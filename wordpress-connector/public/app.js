const actions = [
  { id: 'post-publish', group: 'Posts', label: 'Publish post', title: 'Create a post', description: 'Publish a new WordPress post immediately.', method: 'POST /posts', submit: 'Publish post' },
  { id: 'post-update', group: 'Posts', label: 'Update post', title: 'Update a post', description: 'Change the title, body, or status of an existing post.', method: 'PATCH /posts/{id}', submit: 'Save post' },
  { id: 'post-draft', group: 'Posts', label: 'Save draft', title: 'Create a draft', description: 'Save a post privately as a draft.', method: 'POST /posts', submit: 'Save draft' },
  { id: 'post-schedule', group: 'Posts', label: 'Schedule post', title: 'Schedule a post', description: 'Set a future publish date in the WordPress site timezone.', method: 'POST /posts', submit: 'Schedule post' },
  { id: 'page-create', group: 'Pages', label: 'Create page', title: 'Create a page', description: 'Publish a new page on the WordPress site.', method: 'POST /pages', submit: 'Publish page' },
  { id: 'page-update', group: 'Pages', label: 'Update page', title: 'Update a page', description: 'Change the title, body, or status of an existing page.', method: 'PATCH /pages/{id}', submit: 'Save page' },
  { id: 'media-upload', group: 'Media', label: 'Upload media', title: 'Upload a media file', description: 'Add an image, PDF, or video to the WordPress Media Library.', method: 'POST /media', submit: 'Upload media' },
  { id: 'post-attachment', group: 'Media', label: 'Post + attachment', title: 'Create a post with an attachment', description: 'Upload a file first, then publish a post using it as the featured image.', method: 'POST /media + /posts', submit: 'Upload and publish' },
  { id: 'category-create', group: 'Categories', label: 'Create category', title: 'Create a category', description: 'Add a category to the WordPress taxonomy.', method: 'POST /categories', submit: 'Create category' },
  { id: 'post-assign-category', group: 'Categories', label: 'Assign category', title: 'Assign a category to a post', description: 'Add a category without removing the post’s existing categories.', method: 'PATCH /posts/{id}', submit: 'Assign category' },
];

const element = (id) => document.getElementById(id);
const actionList = element('action-list');
const formFields = element('form-fields');
const form = element('operation-form');
let activeAction = actions[0];
let configured = false;
let toastTimer;

const fieldTemplates = {
  title: { label: 'Title', type: 'text', required: true, full: true, max: 300, placeholder: 'Enter a clear title' },
  content: { label: 'Content', type: 'textarea', full: true, placeholder: 'Write the post or page content' },
  id: { label: 'Post ID', type: 'post-id', required: true, hint: 'Enter a numeric ID or load posts to select one.' },
  pageId: { label: 'Page ID', type: 'page-id', required: true, hint: 'Enter a numeric ID or load pages to select one.' },
  status: { label: 'Status', type: 'select', options: [['publish', 'Published'], ['draft', 'Draft'], ['pending', 'Pending review'], ['private', 'Private']] },
  createStatus: { label: 'Post status', type: 'select', options: [['publish', 'Publish now'], ['draft', 'Save as draft']] },
  date: { label: 'Publish date and time', type: 'datetime-local', required: true, full: true, hint: 'WordPress interprets this in the site timezone.' },
  file: { label: 'File', type: 'file', required: true, full: true, hint: 'PNG, JPG, PDF, or video. Local connector limit: 32 MB.' },
  name: { label: 'Category name', type: 'text', required: true, max: 200, placeholder: 'e.g. Technology' },
  slug: { label: 'Category slug', type: 'text', max: 200, placeholder: 'Generated from the name if blank' },
  postId: { label: 'Post ID', type: 'post-id', required: true, hint: 'Enter a numeric ID or load posts to select one.' },
  categoryId: { label: 'Category', type: 'category-id', required: true, hint: 'Enter an ID or load categories to select one.' },
};

const fieldsByAction = {
  'post-publish': ['title', 'content'],
  'post-update': ['id', 'title', 'content', 'status'],
  'post-draft': ['title', 'content'],
  'post-schedule': ['title', 'content', 'date'],
  'page-create': ['title', 'content'],
  'page-update': ['pageId', 'title', 'content', 'status'],
  'media-upload': ['file'],
  'post-attachment': ['title', 'content', 'createStatus', 'file'],
  'category-create': ['name', 'slug'],
  'post-assign-category': ['postId', 'categoryId'],
};

function escapeHtml(value) {
  return String(value ?? '').replace(/[&<>"']/g, (character) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  })[character]);
}

function renderNav() {
  let previousGroup = '';
  actionList.innerHTML = actions.map((action, index) => {
    const heading = action.group !== previousGroup ? `<div class="group-heading">${escapeHtml(action.group)}</div>` : '';
    previousGroup = action.group;
    return `${heading}<button class="action-button" type="button" data-action="${action.id}" aria-current="${action.id === activeAction.id ? 'page' : 'false'}">
      <span class="action-number">${String(index + 1).padStart(2, '0')}</span>
      <span class="action-label">${escapeHtml(action.label)}</span>
      <span class="action-method">${escapeHtml(action.method.split(' ')[0])}</span>
    </button>`;
  }).join('');
  actionList.querySelectorAll('[data-action]').forEach((button) => {
    button.addEventListener('click', () => selectAction(button.dataset.action));
  });
}

function renderField(name) {
  const field = fieldTemplates[name];
  const fullClass = field.full ? ' field-full' : '';
  const isRequired = field.required && !(name === 'title' && ['post-update', 'page-update'].includes(activeAction.id));
  const required = isRequired ? '<span class="required">*</span>' : '';
  const requiredAttr = isRequired ? 'required' : '';
  const hint = field.hint ? `<p class="field-hint">${escapeHtml(field.hint)}</p>` : '';
  let control = '';

  if (field.type === 'textarea') {
    control = `<textarea name="${name}" placeholder="${escapeHtml(field.placeholder)}"></textarea>`;
  } else if (field.type === 'select') {
    control = `<select name="${name}"><option value="">Keep current status</option>${field.options.map(([value, label]) => `<option value="${value}">${label}</option>`).join('')}</select>`;
  } else if (field.type === 'file') {
    control = `<div class="file-drop"><input name="${name}" type="file" accept="image/*,application/pdf,video/*" ${requiredAttr} /></div>`;
  } else if (field.type === 'post-id') {
    const listId = `${name}-choices`;
    control = `<div class="id-control"><input name="${name}" type="number" min="1" step="1" list="${listId}" placeholder="Post ID" ${requiredAttr} /><button class="load-button" type="button" data-load="posts" data-target="${listId}">Load posts</button></div><datalist id="${listId}"></datalist>`;
  } else if (field.type === 'page-id') {
    const listId = `${name}-choices`;
    control = `<div class="id-control"><input name="${name}" type="number" min="1" step="1" list="${listId}" placeholder="Page ID" ${requiredAttr} /><button class="load-button" type="button" data-load="pages" data-target="${listId}">Load pages</button></div><datalist id="${listId}"></datalist>`;
  } else if (field.type === 'category-id') {
    const listId = `${name}-choices`;
    control = `<div class="id-control"><input name="${name}" type="number" min="1" step="1" list="${listId}" placeholder="Category ID" ${requiredAttr} /><button class="load-button" type="button" data-load="categories" data-target="${listId}">Load</button></div><datalist id="${listId}"></datalist>`;
  } else {
    const type = field.type === 'number' ? 'number' : field.type;
    const min = field.type === 'number' ? 'min="1" step="1"' : '';
    control = `<input name="${name}" type="${type}" maxlength="${field.max ?? 256}" placeholder="${escapeHtml(field.placeholder)}" ${min} ${requiredAttr} />`;
  }

  return `<div class="field${fullClass}"><label for="field-${name}">${escapeHtml(field.label)} ${required}</label>${control.replace(`name="${name}"`, `id="field-${name}" name="${name}"`)}${hint}</div>`;
}

function renderForm() {
  element('action-group').textContent = activeAction.group;
  element('action-title').textContent = activeAction.title;
  element('action-description').textContent = activeAction.description;
  element('action-method').textContent = activeAction.method;
  element('submit-label').textContent = activeAction.submit;
  element('form-fields').innerHTML = fieldsByAction[activeAction.id].map(renderField).join('');
  element('form-note').textContent = activeAction.id === 'post-assign-category'
    ? 'Existing categories will be retained.'
    : 'Changes are sent to the configured WordPress site.';
  element('form-subtitle').textContent = activeAction.id === 'media-upload'
    ? 'The file will be added to the WordPress Media Library.'
    : 'Complete the fields and send them to WordPress.';
  element('submit-button').disabled = !configured;
  element('result-empty').hidden = false;
  element('result-content').hidden = true;

  formFields.querySelectorAll('[data-load]').forEach((button) => {
    button.addEventListener('click', () => loadChoices(button.dataset.load, button.dataset.target));
  });
}

function selectAction(id) {
  activeAction = actions.find((action) => action.id === id) ?? actions[0];
  renderNav();
  renderForm();
  element('action-title').focus?.();
  if (activeAction.id === 'post-update' || activeAction.id === 'post-assign-category') {
    void loadChoices('posts', 'id-choices');
    void loadChoices('posts', 'postId-choices');
  }
  if (activeAction.id === 'page-update') void loadChoices('pages', 'pageId-choices');
  if (activeAction.id === 'post-assign-category') void loadChoices('categories', 'categoryId-choices');
}

async function loadChoices(type, listId) {
  const list = document.getElementById(listId);
  const button = formFields.querySelector(`[data-target="${listId}"]`);
  if (!list) return;
  if (button) {
    button.disabled = true;
    button.textContent = 'Loading';
  }
  try {
    const response = await fetch(`/api/${type}`);
    const data = await response.json();
    if (!response.ok) throw new Error(data.error ?? `Could not load ${type}.`);
    list.innerHTML = data.map((item) => {
      const label = type === 'categories' ? item.name : `${item.title} (${item.status})`;
      return `<option value="${item.id}" label="${escapeHtml(label)}"></option>`;
    }).join('');
    showToast(`${data.length} ${type} loaded`);
  } catch (error) {
    showToast(error.message, true);
  } finally {
    if (button) {
      button.disabled = false;
      button.textContent = type === 'categories' ? 'Load' : `Load ${type}`;
    }
  }
}

function showResult(result, action) {
  element('result-empty').hidden = true;
  const panel = element('result-content');
  panel.hidden = false;
  const item = result.media ?? result;
  const name = item.title || item.name || item.fileName || action.title;
  const identifier = item.id ? `ID ${item.id}` : '';
  const status = result.postStatus || result.pageStatus || (result.url ? 'Uploaded' : 'Complete');
  const postLink = result.media && result.link ? `<a class="result-link" href="${escapeHtml(result.link)}" target="_blank" rel="noreferrer">Open created post ↗</a>` : '';
  panel.innerHTML = `<div class="result-state"><span class="result-state-dot"></span>${escapeHtml(status)}</div>
    <h3>${escapeHtml(name)}</h3>
    <p>${escapeHtml(identifier)}${result.media ? ` · Attachment ${result.media.id}` : ''}</p>
    ${postLink}
    ${item.url || item.link ? `<a class="result-link" href="${escapeHtml(item.url || item.link)}" target="_blank" rel="noreferrer">Open in WordPress ↗</a>` : ''}
    ${result.media?.url ? `<p class="result-media-url">Media URL: <a href="${escapeHtml(result.media.url)}" target="_blank" rel="noreferrer">${escapeHtml(result.media.url)}</a></p>` : ''}`;
}

function showError(message) {
  element('result-empty').hidden = true;
  const panel = element('result-content');
  panel.hidden = false;
  panel.innerHTML = `<div class="result-state error"><span class="result-state-dot"></span>Request failed</div><h3>WordPress did not complete the action</h3><p>${escapeHtml(message)}</p>`;
}

function showToast(message, error = false) {
  const toast = element('toast');
  toast.textContent = message;
  toast.dataset.visible = 'true';
  toast.dataset.error = error ? 'true' : 'false';
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => { toast.dataset.visible = 'false'; }, 2600);
}

function valueOf(data, name) {
  const value = data.get(name);
  return typeof value === 'string' ? value : '';
}

function buildPayload(data) {
  const payload = { action: activeAction.id };
  for (const field of fieldsByAction[activeAction.id]) {
    if (field === 'file') continue;
    const value = valueOf(data, field);
    if (value !== '') payload[field] = value;
  }
  if (activeAction.id === 'post-attachment' && payload.createStatus) {
    payload.status = payload.createStatus;
    delete payload.createStatus;
  }
  if (activeAction.id === 'page-update') payload.id = payload.pageId;
  return payload;
}

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  if (!configured) {
    showError('Set the local WP_APP_PASSWORD in .env, then restart the connector.');
    return;
  }

  const submitButton = element('submit-button');
  const submitLabel = element('submit-label');
  const formData = new FormData(form);
  const hasFile = fieldsByAction[activeAction.id].includes('file');
  let body;

  if (hasFile) {
    body = new FormData();
    const file = formData.get('file');
    if (file instanceof File && file.size > 0) body.append('file', file);
    for (const [key, value] of Object.entries(buildPayload(formData))) body.append(key, value);
  } else {
    body = JSON.stringify(buildPayload(formData));
  }

  submitButton.disabled = true;
  submitLabel.textContent = 'Sending…';
  try {
    const response = await fetch('/api/actions', {
      method: 'POST',
      headers: hasFile ? {} : { 'Content-Type': 'application/json' },
      body,
    });
    const data = await response.json();
    if (!response.ok || !data.ok) throw new Error(data.error ?? 'WordPress request failed.');
    showResult(data.result, activeAction);
    showToast('WordPress action completed');
    if (activeAction.id === 'category-create') void loadChoices('categories', 'categoryId-choices');
  } catch (error) {
    showError(error.message);
  } finally {
    submitButton.disabled = !configured;
    submitLabel.textContent = activeAction.submit;
  }
});

async function loadHealth() {
  try {
    const response = await fetch('/api/health', { cache: 'no-store' });
    const data = await response.json();
    const connection = element('connection-status');
    element('site-name').textContent = new URL(data.site).host;
    element('site-link').href = data.site;
    configured = Boolean(data.configured);
    connection.dataset.state = configured ? 'ready' : 'error';
    element('connection-copy').textContent = configured ? 'Credentials configured' : 'Setup required';
    element('config-notice').hidden = configured;
    renderForm();
  } catch {
    element('connection-status').dataset.state = 'error';
    element('connection-copy').textContent = 'Server unavailable';
    configured = false;
    element('config-notice').hidden = false;
    renderForm();
  }
}

renderNav();
renderForm();
void loadHealth();