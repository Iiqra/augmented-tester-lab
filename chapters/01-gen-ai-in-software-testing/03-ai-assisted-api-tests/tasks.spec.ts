import { test, expect } from '@playwright/test';
import { Twodos, unwrap, idOf, uniqueLabel } from '../../../src/twodos-client';

// Reviewed tests for 02-test-cases-from-a-story/reviewed-test-cases.json (TC01-TC10).
// Every test creates its own list and removes it, so runs are repeatable.

let api: Twodos;
let listId: string;

test.beforeEach(async ({ request }) => {
  api = await new Twodos(request).login();
  listId = await api.createListAndGetId(uniqueLabel('ch1'));
});

test.afterEach(async () => {
  if (listId) await api.deleteList(listId);
});

test('TC01 add a task with a valid title', async () => {
  const res = await api.addTask(listId, 'Buy milk');
  expect(res.statusCode).toBe(200);
  const items = await api.items(listId);
  expect(items).toHaveLength(1);
  expect(items[0]).toMatchObject({ title: 'Buy milk', done: false });
});

test('TC02 reject a task without a title', async () => {
  const res = await api.call('post', `/api/todos/${listId}`, { done: false });
  expect(res).toMatchObject({ statusCode: 400, reason: 'MISSING_FIELD' });
  expect(await api.items(listId)).toHaveLength(0);
});

test('TC03 reject a title above the maximum length', async () => {
  const res = await api.addTask(listId, 'a'.repeat(256));
  expect(res).toMatchObject({ statusCode: 400, reason: 'VALIDATION_ERROR' });
});

test('TC04 accept a title of 250 characters', async () => {
  const title = 'a'.repeat(250);
  expect((await api.addTask(listId, title)).statusCode).toBe(200);
  expect((await api.items(listId))[0].title).toBe(title);
});

test.fixme('TC05 titles of 251-255 characters', async () => {
  // OPEN QUESTION: the OpenAPI schema says max 255, the spec's own example error says 250.
  // Confirm the real rule with the product owner, then turn this into a real assertion.
});

test('TC06 description is optional and limited to 1000 characters', async () => {
  expect((await api.addTask(listId, 'With notes', { description: 'd'.repeat(1000) })).statusCode).toBe(200);
  const tooLong = await api.addTask(listId, 'Too long', { description: 'd'.repeat(1001) });
  expect(tooLong).toMatchObject({ statusCode: 400, reason: 'VALIDATION_ERROR' });
});

test('TC07 mark a task done and not done again', async () => {
  await api.addTask(listId, 'Call the landlord');
  const itemId = idOf((await api.items(listId))[0]);

  expect((await api.setDone(listId, itemId, true)).statusCode).toBe(200);
  expect((await api.items(listId))[0].done).toBe(true);

  expect((await api.setDone(listId, itemId, false)).statusCode).toBe(200);
  expect((await api.items(listId))[0].done).toBe(false);
});

test('TC08 clear completed removes only done tasks', async () => {
  await api.addTask(listId, 'Done already');
  await api.addTask(listId, 'Still open');
  const done = (await api.items(listId)).find((i) => i.title === 'Done already');
  await api.setDone(listId, idOf(done), true);

  expect((await api.clearDone(listId)).statusCode).toBe(200);
  const titles = (await api.items(listId)).map((i) => i.title);
  expect(titles).toEqual(['Still open']);
});

test('TC09 stop at the tasks-per-list limit', async ({ request }) => {
  test.skip(!!process.env.TWODOS_BASE_URL && !process.env.ALLOW_HEAVY_TESTS,
    'Creates hundreds of tasks; set ALLOW_HEAVY_TESTS=1 to run against a real environment');
  const config = unwrap<any>(await (await request.get('/api/v1/client-config')).json());
  const limit: number = config.limits.itemsPerList;
  for (let i = 0; i < limit; i++) await api.addTask(listId, `task ${i + 1}`);

  const res = await api.addTask(listId, 'one too many');
  expect(res).toMatchObject({ statusCode: 403, reason: 'ITEM_LIMIT_REACHED' });
});

test('TC10 reject requests without a token', async ({ request }) => {
  const body = await (await request.get('/api/todos')).json();
  expect(body).toMatchObject({ statusCode: 401, reason: 'UNAUTHORIZED' });
});
