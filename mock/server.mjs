// Local mock of the documented twodos REST API (subset used by the exercises).
// Purpose: practise and run every exercise offline, without touching real accounts.
// It mirrors the behaviour documented in the public OpenAPI spec (twodos.app/openapi.json):
//   - HTTP 200 with the real status in the body: { statusCode, data } or { statusCode, reason, statusMessage }
//   - create endpoints return data: true (no id)
// It is NOT the real service. Anything the docs leave open is marked "ASSUMPTION".
import http from 'node:http';
import { randomUUID } from 'node:crypto';

const PORT = Number(process.env.MOCK_PORT || 4010);
// ASSUMPTION: the spec schema says task title max 255, but its own example error says 250.
// The mock follows the schema; chapter 1 uses this gap as a requirement-review example.
const TITLE_MAX = Number(process.env.MOCK_TITLE_MAX || 255);
const LIMITS = { listsPerAccount: 50, itemsPerList: 200 };

const users = new Map([['tester@example.com', { id: 'u1', password: 'correct-horse' }]]);
const tokens = new Map(); // token -> userId
const lists = new Map();  // listId -> { id, label, owner, items: [] }

const ok = (data) => ({ statusCode: 200, data });
const err = (statusCode, reason, statusMessage) => ({ statusCode, reason, statusMessage });

function send(res, body, httpStatus = 200) {
  res.writeHead(httpStatus, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(body));
}

async function readBody(req) {
  let raw = '';
  for await (const chunk of req) raw += chunk;
  try { return raw ? JSON.parse(raw) : {}; } catch { return {}; }
}

function auth(req) {
  const h = req.headers.authorization || '';
  return tokens.get(h.replace(/^Bearer\s+/i, '')) || null;
}

function validateTitle(title) {
  if (title === undefined || title === null || title === '') return err(400, 'MISSING_FIELD', "The 'title' field is required.");
  if (String(title).length > TITLE_MAX) return err(400, 'VALIDATION_ERROR', `The 'title' field must be ${TITLE_MAX} characters or fewer.`);
  return null;
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const p = url.pathname.split('/').filter(Boolean); // e.g. ['api','todos',':id']
  const m = req.method;
  const body = ['POST', 'PUT', 'PATCH'].includes(m) ? await readBody(req) : {};

  if (m === 'GET' && url.pathname === '/health') return send(res, { status: 'OK', version: 'mock', supportedApiVersions: ['v1'] });
  if (m === 'GET' && url.pathname === '/api/v1/client-config')
    return send(res, ok({ rateLimits: { auth: { max: 10, windowMinutes: 15 }, api: { max: 300, windowMinutes: 1 } }, limits: LIMITS }));

  if (m === 'POST' && url.pathname === '/api/account/login') {
    const u = users.get(body.email);
    if (!u || u.password !== body.password) return send(res, err(401, 'UNAUTHORIZED', 'Invalid email or password.'));
    const token = randomUUID();
    tokens.set(token, u.id);
    return send(res, ok({ token, expiresAt: new Date(Date.now() + 3600e3).toISOString(), refreshToken: randomUUID() }));
  }

  if (p[0] !== 'api' || p[1] !== 'todos') return send(res, err(404, 'NOT_FOUND', 'Route not found.'));
  const userId = auth(req);
  if (!userId) return send(res, err(401, 'UNAUTHORIZED', 'Authentication required.'));

  const mine = () => [...lists.values()].filter((l) => l.owner === userId);
  const getList = (id) => { const l = lists.get(id); return l && l.owner === userId ? l : null; };

  // /api/todos
  if (p.length === 2) {
    if (m === 'GET') return send(res, ok(mine()));
    if (m === 'POST') {
      if (!body.label) return send(res, err(400, 'MISSING_FIELD', "The 'label' field is required."));
      if (String(body.label).length > 250) return send(res, err(400, 'VALIDATION_ERROR', "The 'label' field must be 250 characters or fewer."));
      if (mine().length >= LIMITS.listsPerAccount) return send(res, err(403, 'LIST_LIMIT_REACHED', 'List limit reached.'));
      const id = randomUUID();
      lists.set(id, { id, label: body.label, owner: userId, items: [] });
      return send(res, ok(true));
    }
  }

  // /api/todos/clear-done/:listId
  if (p[2] === 'clear-done' && m === 'PUT') {
    const l = getList(p[3]);
    if (!l) return send(res, err(404, 'NOT_FOUND', 'List not found.'));
    l.items = l.items.filter((i) => !i.done);
    return send(res, ok(true));
  }

  const list = getList(p[2]);
  if (!list) return send(res, err(404, 'NOT_FOUND', 'List not found.'));

  // /api/todos/:listId
  if (p.length === 3) {
    if (m === 'GET') return send(res, ok(list));
    if (m === 'DELETE') { lists.delete(list.id); return send(res, ok('List deleted.')); }
    if (m === 'POST') {
      const e = validateTitle(body.title);
      if (e) return send(res, e);
      if (typeof body.done !== 'boolean') return send(res, err(400, 'MISSING_FIELD', "The 'done' field is required."));
      if (body.description && String(body.description).length > 1000)
        return send(res, err(400, 'VALIDATION_ERROR', "The 'description' field must be 1000 characters or fewer."));
      if (list.items.length >= LIMITS.itemsPerList) return send(res, err(403, 'ITEM_LIMIT_REACHED', 'Item limit reached.'));
      list.items.push({ id: randomUUID(), title: body.title, description: body.description ?? null, done: body.done, order: list.items.length });
      return send(res, ok(true));
    }
  }

  // /api/todos/:listId/:itemId[/done|/title]
  const item = list.items.find((i) => i.id === p[3]);
  if (p.length >= 4 && !item) return send(res, err(404, 'NOT_FOUND', 'Item not found.'));
  if (p.length === 4 && m === 'DELETE') { list.items = list.items.filter((i) => i !== item); return send(res, ok('Item deleted.')); }
  if (p.length === 5 && p[4] === 'done' && m === 'PATCH') {
    if (typeof body.done !== 'boolean') return send(res, err(400, 'MISSING_FIELD', "The 'done' field is required."));
    item.done = body.done; return send(res, ok(true));
  }
  if (p.length === 5 && p[4] === 'title' && m === 'PATCH') {
    const e = validateTitle(body.title); if (e) return send(res, e);
    item.title = body.title; return send(res, ok(true));
  }
  return send(res, err(404, 'NOT_FOUND', 'Route not found.'));
});

server.listen(PORT, () => console.log(`twodos mock listening on http://localhost:${PORT} (test user: tester@example.com / correct-horse)`));
