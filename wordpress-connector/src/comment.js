const baseUrl = process.env.WP_BASE_URL;
const username = process.env.WP_USERNAME;
const applicationPassword = process.env.WP_APP_PASSWORD;
const postSlug = 'hello-world-2';
const commentText = 'Hello World Hari Krishnan-2';

if (!baseUrl || !username || !applicationPassword) {
  throw new Error('Set WP_BASE_URL, WP_USERNAME, and WP_APP_PASSWORD in .env.');
}

const siteUrl = new URL(baseUrl);
if (siteUrl.protocol !== 'https:') {
  throw new Error('WP_BASE_URL must use HTTPS.');
}

const password = applicationPassword.replace(/\s/g, '');
const authorization = `Basic ${Buffer.from(`${username}:${password}`, 'utf8').toString('base64')}`;

async function request(endpoint, options = {}) {
  const url = new URL(endpoint, `${siteUrl.origin}/wp-json/wp/v2/`);
  const response = await fetch(url, {
    ...options,
    headers: {
      Accept: 'application/json',
      Authorization: authorization,
      ...(options.body ? { 'Content-Type': 'application/json' } : {}),
      ...options.headers,
    },
    ...(options.body ? { body: JSON.stringify(options.body) } : {}),
  });
  const data = await response.json().catch(() => null);
  if (!response.ok) {
    const detail = typeof data?.message === 'string' ? data.message : 'request failed';
    throw new Error(`WordPress API returned ${response.status}: ${detail}`);
  }
  return data;
}

function plainCommentContent(comment) {
  const content = comment.content;
  if (typeof content === 'string') return content;
  return content?.raw ?? content?.rendered ?? '';
}

const user = await request('users/me?context=edit&_fields=id,name,slug');
const posts = await request(`posts?slug=${encodeURIComponent(postSlug)}&_fields=id,slug,link,title,comment_status`);
const post = posts.find((item) => item.slug === postSlug);

if (!post) throw new Error(`The WordPress post "${postSlug}" was not found.`);
if (post.comment_status !== 'open') {
  throw new Error(`Comments are closed for ${post.link}.`);
}

const existingComments = await request(
  `comments?post=${post.id}&author=${user.id}&per_page=100&context=edit&_fields=id,author,content,status`,
);
const existing = existingComments.find(
  (comment) => plainCommentContent(comment).trim() === commentText,
);

if (existing) {
  console.log(JSON.stringify({
    result: 'already_exists',
    commentId: existing.id,
    status: existing.status,
    postUrl: post.link,
  }, null, 2));
} else {
  const comment = await request('comments', {
    method: 'POST',
    body: { post: post.id, content: commentText },
  });
  console.log(JSON.stringify({
    result: comment.status === 'hold' ? 'submitted_for_moderation' : 'created',
    commentId: comment.id,
    status: comment.status,
    author: user.name,
    postUrl: post.link,
    commentUrl: comment.link,
  }, null, 2));
}
