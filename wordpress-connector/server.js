import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { basename, extname, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import Busboy from 'busboy';

const root = fileURLToPath(new URL('.', import.meta.url));
const publicRoot = resolve(root, 'public');
const maxJsonBytes = 2 * 1024 * 1024;
const maxUploadBytes = 32 * 1024 * 1024;

try {
  process.loadEnvFile(resolve(root, '.env'));
} catch (error) {
  if (error.code !== 'ENOENT') throw error;
}

class HttpError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}

function sendJson(response, status, value) {
  response.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store',
    'X-Content-Type-Options': 'nosniff',
  });
  response.end(JSON.stringify(value));
}

function assertSameOrigin(request) {
  const origin = request.headers.origin;
  if (!origin) return;
  try {
    if (new URL(origin).host !== request.headers.host) {
      throw new HttpError(403, 'Cross-origin requests are not allowed.');
    }
  } catch (error) {
    if (error instanceof HttpError) throw error;
    throw new HttpError(403, 'Invalid request origin.');
  }
}

function getWordPressConfig() {
  const baseUrl = process.env.WP_BASE_URL?.trim();
  const username = process.env.WP_USERNAME?.trim();
  const appPassword = process.env.WP_APP_PASSWORD?.replace(/\s/g, '');

  if (!baseUrl || !username || !appPassword) {
    throw new HttpError(503, 'Set WP_BASE_URL, WP_USERNAME, and WP_APP_PASSWORD in .env.');
  }

  let site;
  try {
    site = new URL(baseUrl);
  } catch {
    throw new HttpError(500, 'WP_BASE_URL is not a valid URL.');
  }
  if (site.protocol !== 'https:') {
    throw new HttpError(500, 'WP_BASE_URL must use HTTPS.');
  }

  return { site, username, appPassword };
}

async function wpRequest(endpoint, options = {}) {
  const { site, username, appPassword } = getWordPressConfig();
  const url = new URL(`/wp-json/wp/v2/${endpoint.replace(/^\/+/, '')}`, site);
  const hasBody = options.body !== undefined;
  const response = await fetch(url, {
    method: options.method ?? 'GET',
    headers: {
      Accept: 'application/json',
      Authorization: `Basic ${Buffer.from(`${username}:${appPassword}`, 'utf8').toString('base64')}`,
      ...(hasBody && !Buffer.isBuffer(options.body) ? { 'Content-Type': 'application/json' } : {}),
      ...options.headers,
    },
    ...(hasBody
      ? { body: Buffer.isBuffer(options.body) ? options.body : JSON.stringify(options.body) }
      : {}),
    signal: AbortSignal.timeout(90_000),
  });

  const raw = await response.text();
  let data;
  try {
    data = raw ? JSON.parse(raw) : null;
  } catch {
    data = null;
  }

  if (!response.ok) {
    const message = typeof data?.message === 'string'
      ? data.message
      : `WordPress returned HTTP ${response.status}.`;
    throw new HttpError(response.status, message);
  }
  return data;
}

function requiredText(input, name, maxLength = 200_000) {
  const value = typeof input[name] === 'string' ? input[name].trim() : '';
  if (!value) throw new HttpError(400, `${name} is required.`);
  if (value.length > maxLength) throw new HttpError(400, `${name} is too long.`);
  return value;
}

function optionalText(input, name, maxLength = 200_000) {
  if (!Object.hasOwn(input, name)) return undefined;
  if (typeof input[name] !== 'string') throw new HttpError(400, `${name} must be text.`);
  if (input[name].length > maxLength) throw new HttpError(400, `${name} is too long.`);
  return input[name];
}

function requiredId(input, name) {
  const value = Number(input[name]);
  if (!Number.isSafeInteger(value) || value < 1) {
    throw new HttpError(400, `${name} must be a positive numeric ID.`);
  }
  return value;
}

function makePostFields(input, status) {
  return {
    title: requiredText(input, 'title', 300),
    content: optionalText(input, 'content'),
    status,
  };
}

function makeUpdateFields(input) {
  const fields = {};
  for (const name of ['title', 'content']) {
    const value = optionalText(input, name, name === 'title' ? 300 : 200_000);
    if (value !== undefined) fields[name] = value;
  }
  const status = optionalText(input, 'status', 20);
  if (status !== undefined) {
    if (!['publish', 'draft', 'pending', 'private', 'future'].includes(status)) {
      throw new HttpError(400, 'Choose a valid post status.');
    }
    fields.status = status;
  }
  if (Object.keys(fields).length === 0) {
    throw new HttpError(400, 'Provide at least one field to update.');
  }
  return fields;
}

function safeFilename(value) {
  const name = basename(value || 'upload').replace(/[^A-Za-z0-9._-]/g, '_').slice(0, 180);
  return name || 'upload';
}

async function uploadMedia(file) {
  if (!file?.buffer?.length) throw new HttpError(400, 'Choose a file to upload.');
  const filename = safeFilename(file.filename);
  const media = await wpRequest('media', {
    method: 'POST',
    headers: {
      'Content-Type': file.mimeType || 'application/octet-stream',
      'Content-Disposition': `attachment; filename="${filename}"`,
    },
    body: file.buffer,
  });
  return {
    id: media.id,
    title: media.title?.rendered ?? filename,
    fileName: filename,
    mimeType: media.mime_type,
    url: media.source_url,
    link: media.link,
  };
}

async function runAction(input, file) {
  const action = input.action;
  switch (action) {
    case 'post-publish': {
      const post = await wpRequest('posts', {
        method: 'POST',
        body: makePostFields(input, 'publish'),
      });
      return { status: 201, result: { id: post.id, title: post.title?.rendered, link: post.link, postStatus: post.status } };
    }

    case 'post-update': {
      const id = requiredId(input, 'id');
      const post = await wpRequest(`posts/${id}`, {
        method: 'PATCH',
        body: makeUpdateFields(input),
      });
      return { status: 200, result: { id: post.id, title: post.title?.rendered, link: post.link, postStatus: post.status } };
    }

    case 'post-draft': {
      const post = await wpRequest('posts', {
        method: 'POST',
        body: makePostFields(input, 'draft'),
      });
      return { status: 201, result: { id: post.id, title: post.title?.rendered, link: post.link, postStatus: post.status } };
    }

    case 'post-schedule': {
      const date = requiredText(input, 'date', 40);
      if (!Number.isFinite(Date.parse(date))) throw new HttpError(400, 'Enter a valid publish date and time.');
      const post = await wpRequest('posts', {
        method: 'POST',
        body: { ...makePostFields(input, 'future'), date },
      });
      return { status: 201, result: { id: post.id, title: post.title?.rendered, link: post.link, postStatus: post.status, date: post.date } };
    }

    case 'page-create': {
      const page = await wpRequest('pages', {
        method: 'POST',
        body: makePostFields(input, 'publish'),
      });
      return { status: 201, result: { id: page.id, title: page.title?.rendered, link: page.link, pageStatus: page.status } };
    }

    case 'page-update': {
      const id = requiredId(input, 'id');
      const page = await wpRequest(`pages/${id}`, {
        method: 'PATCH',
        body: makeUpdateFields(input),
      });
      return { status: 200, result: { id: page.id, title: page.title?.rendered, link: page.link, pageStatus: page.status } };
    }

    case 'media-upload': {
      const media = await uploadMedia(file);
      return { status: 201, result: media };
    }

    case 'post-attachment': {
      const status = input.status || 'publish';
      if (!['publish', 'draft', 'pending', 'private'].includes(status)) {
        throw new HttpError(400, 'Choose a valid status for the new post.');
      }
      const postFields = makePostFields(input, status);
      const media = await uploadMedia(file);
      const post = await wpRequest('posts', {
        method: 'POST',
        body: {
          ...postFields,
          featured_media: media.id,
        },
      });
      return {
        status: 201,
        result: { id: post.id, title: post.title?.rendered, link: post.link, postStatus: post.status, media },
      };
    }

    case 'category-create': {
      const name = requiredText(input, 'name', 200);
      const slug = optionalText(input, 'slug', 200);
      const category = await wpRequest('categories', {
        method: 'POST',
        body: { name, ...(slug ? { slug } : {}) },
      });
      return { status: 201, result: { id: category.id, name: category.name, slug: category.slug, link: category.link } };
    }

    case 'post-assign-category': {
      const postId = requiredId(input, 'postId');
      const categoryId = requiredId(input, 'categoryId');
      const post = await wpRequest(`posts/${postId}?context=edit&_fields=id,categories,title,link`);
      const categories = [...new Set([...(post.categories ?? []), categoryId])];
      const updated = await wpRequest(`posts/${postId}`, {
        method: 'PATCH',
        body: { categories },
      });
      return { status: 200, result: { id: updated.id, title: updated.title?.rendered, link: updated.link, categories: updated.categories } };
    }

    default:
      throw new HttpError(400, 'Choose one of the available WordPress actions.');
  }
}

async function readJson(request) {
  const chunks = [];
  let size = 0;
  for await (const chunk of request) {
    size += chunk.length;
    if (size > maxJsonBytes) throw new HttpError(413, 'Request body is too large.');
    chunks.push(chunk);
  }
  try {
    return JSON.parse(Buffer.concat(chunks).toString('utf8'));
  } catch {
    throw new HttpError(400, 'Request body must be valid JSON.');
  }
}

function readMultipart(request) {
  return new Promise((resolveMultipart, rejectMultipart) => {
    let parser;
    try {
      parser = Busboy({
        headers: request.headers,
        limits: { files: 1, fileSize: maxUploadBytes, fields: 20, fieldSize: 256 * 1024 },
      });
    } catch {
      rejectMultipart(new HttpError(400, 'Invalid multipart upload.'));
      return;
    }

    const fields = {};
    let file;
    let failure;

    parser.on('field', (name, value) => {
      fields[name] = value;
    });
    parser.on('file', (name, stream, info) => {
      if (name !== 'file') {
        stream.resume();
        return;
      }
      const chunks = [];
      stream.on('data', (chunk) => chunks.push(chunk));
      stream.on('limit', () => {
        failure = new HttpError(413, 'Files must be 32 MB or smaller.');
      });
      stream.on('end', () => {
        if (!stream.truncated) {
          file = {
            filename: info.filename,
            mimeType: info.mimeType,
            buffer: Buffer.concat(chunks),
          };
        }
      });
    });
    parser.on('filesLimit', () => {
      failure = new HttpError(400, 'Upload one file at a time.');
    });
    parser.on('fieldsLimit', () => {
      failure = new HttpError(400, 'Too many form fields.');
    });
    parser.on('error', () => rejectMultipart(new HttpError(400, 'Could not read the upload.')));
    parser.on('close', () => {
      if (failure) rejectMultipart(failure);
      else resolveMultipart({ fields, file });
    });
    request.pipe(parser);
  });
}

async function serveStatic(pathname, response) {
  let decoded;
  try {
    decoded = decodeURIComponent(pathname);
  } catch {
    throw new HttpError(400, 'Invalid path.');
  }
  const relative = decoded === '/' ? 'index.html' : decoded.replace(/^\/+/, '');
  const filePath = resolve(publicRoot, relative);
  if (!filePath.startsWith(`${publicRoot}${sep}`)) throw new HttpError(403, 'Forbidden.');

  let fileInfo;
  try {
    fileInfo = await stat(filePath);
  } catch {
    throw new HttpError(404, 'Not found.');
  }
  if (!fileInfo.isFile()) throw new HttpError(404, 'Not found.');

  const mimeTypes = {
    '.css': 'text/css; charset=utf-8',
    '.html': 'text/html; charset=utf-8',
    '.js': 'text/javascript; charset=utf-8',
    '.svg': 'image/svg+xml',
  };
  const content = await readFile(filePath);
  response.writeHead(200, {
    'Content-Type': mimeTypes[extname(filePath)] ?? 'application/octet-stream',
    'Content-Length': content.length,
    'X-Content-Type-Options': 'nosniff',
    'Cache-Control': 'no-store',
  });
  response.end(content);
}

async function handleRequest(request, response) {
  const url = new URL(request.url, `http://${request.headers.host ?? '127.0.0.1'}`);
  if (url.pathname.startsWith('/api/')) assertSameOrigin(request);

  if (request.method === 'GET' && url.pathname === '/api/health') {
    const configured = Boolean(
      process.env.WP_BASE_URL?.trim() &&
      process.env.WP_USERNAME?.trim() &&
      process.env.WP_APP_PASSWORD?.trim(),
    );
    return sendJson(response, 200, {
      configured,
      site: process.env.WP_BASE_URL?.trim() || 'https://team.trustgrid.ai',
    });
  }

  if (request.method === 'GET' && url.pathname === '/api/posts') {
    const search = url.searchParams.get('search')?.trim();
    const query = new URLSearchParams({
      context: 'edit',
      status: 'any',
      per_page: '50',
      orderby: 'date',
      order: 'desc',
      _fields: 'id,title,slug,status,date,link,categories',
      ...(search ? { search } : {}),
    });
    const posts = await wpRequest(`posts?${query}`);
    return sendJson(response, 200, posts.map((post) => ({
      id: post.id,
      title: post.title?.rendered ?? post.slug,
      slug: post.slug,
      status: post.status,
      date: post.date,
      link: post.link,
      categories: post.categories,
    })));
  }

  if (request.method === 'GET' && url.pathname === '/api/pages') {
    const search = url.searchParams.get('search')?.trim();
    const query = new URLSearchParams({
      context: 'edit',
      status: 'any',
      per_page: '50',
      orderby: 'date',
      order: 'desc',
      _fields: 'id,title,slug,status,date,link',
      ...(search ? { search } : {}),
    });
    const pages = await wpRequest(`pages?${query}`);
    return sendJson(response, 200, pages.map((page) => ({
      id: page.id,
      title: page.title?.rendered ?? page.slug,
      slug: page.slug,
      status: page.status,
      date: page.date,
      link: page.link,
    })));
  }

  if (request.method === 'GET' && url.pathname === '/api/categories') {
    const search = url.searchParams.get('search')?.trim();
    const query = new URLSearchParams({
      per_page: '100',
      orderby: 'name',
      order: 'asc',
      _fields: 'id,name,slug,link',
      ...(search ? { search } : {}),
    });
    return sendJson(response, 200, await wpRequest(`categories?${query}`));
  }

  if (request.method === 'GET' && url.pathname === '/setup') {
    const content = await readFile(resolve(root, 'README.md'));
    response.writeHead(200, {
      'Content-Type': 'text/markdown; charset=utf-8',
      'Content-Length': content.length,
      'X-Content-Type-Options': 'nosniff',
      'Cache-Control': 'no-store',
    });
    return response.end(content);
  }

  if (request.method === 'POST' && url.pathname === '/api/actions') {
    const contentType = request.headers['content-type'] ?? '';
    const { fields, file } = contentType.includes('multipart/form-data')
      ? await readMultipart(request)
      : { fields: await readJson(request), file: undefined };
    const { status, result } = await runAction(fields, file);
    return sendJson(response, status, { ok: true, result });
  }

  if (request.method === 'GET') return serveStatic(url.pathname, response);
  throw new HttpError(405, 'Method not allowed.');
}

const port = Number(process.env.PORT) || 4170;
const server = createServer((request, response) => {
  void handleRequest(request, response).catch((error) => {
    if (response.headersSent) {
      response.destroy();
      return;
    }
    const status = error instanceof HttpError ? error.status : 500;
    const message = error instanceof HttpError ? error.message : 'The local connector failed.';
    sendJson(response, status, { ok: false, error: message });
  });
});

server.listen(port, '127.0.0.1', () => {
  console.log(`WordPress connector running at http://127.0.0.1:${port}`);
});