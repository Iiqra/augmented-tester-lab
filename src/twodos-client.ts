import { expect } from '@playwright/test';
import type { APIRequestContext } from '@playwright/test';

/**
 * Thin helper around the documented twodos REST API (see docs/twodos-under-test.md).
 *
 * twodos returns HTTP 200 for most responses and puts the real status in the body:
 *   success: { statusCode: 200, data: ... }
 *   error:   { statusCode: 4xx, reason: 'VALIDATION_ERROR', statusMessage: '...' }
 * The login response shape is not fully confirmed (token at top level vs data.token),
 * so unwrap() accepts both.
 */
export type Envelope<T = unknown> = { statusCode: number; data?: T; reason?: string; statusMessage?: string };

export function unwrap<T = any>(body: any): T {
  return (body && typeof body === 'object' && 'data' in body ? body.data : body) as T;
}

export const idOf = (x: any): string => x?.id ?? x?._id;

export class Twodos {
  private token = '';
  private request: APIRequestContext;
  constructor(request: APIRequestContext) {
    this.request = request;
  }

  private headers() {
    return this.token ? { Authorization: `Bearer ${this.token}` } : {};
  }

  async login(email = process.env.TWODOS_EMAIL ?? 'tester@example.com', password = process.env.TWODOS_PASSWORD ?? 'correct-horse') {
    const res = await this.request.post('/api/account/login', { data: { email, password, platform: 'PLATFORM::UNKNOWN' } });
    const body = await res.json();
    const token = unwrap<{ token: string }>(body)?.token ?? body?.token;
    expect(token, `login failed: ${JSON.stringify(body)}`).toBeTruthy();
    this.token = token;
    return this;
  }

  async call<T = any>(method: 'get' | 'post' | 'put' | 'patch' | 'delete', path: string, data?: unknown): Promise<Envelope<T>> {
    const res = await this.request[method](path, { headers: this.headers(), data });
    expect(res.status(), `${method.toUpperCase()} ${path} transport status`).toBeLessThan(500);
    return res.json();
  }

  // Lists
  createList = (label: string) => this.call<boolean>('post', '/api/todos', { label });
  getLists = () => this.call<any[]>('get', '/api/todos');
  getList = (listId: string) => this.call<any>('get', `/api/todos/${listId}`);
  deleteList = (listId: string) => this.call<string>('delete', `/api/todos/${listId}`);

  // Tasks
  addTask = (listId: string, title: string, extra: Record<string, unknown> = {}) =>
    this.call<boolean>('post', `/api/todos/${listId}`, { title, done: false, ...extra });
  setDone = (listId: string, itemId: string, done: boolean) =>
    this.call<boolean>('patch', `/api/todos/${listId}/${itemId}/done`, { done });
  clearDone = (listId: string) => this.call<boolean>('put', `/api/todos/clear-done/${listId}`);

  /** Create endpoints return `true` and no id, so look the new list up by its unique label. */
  async createListAndGetId(label: string): Promise<string> {
    const created = await this.createList(label);
    expect(created.statusCode, JSON.stringify(created)).toBe(200);
    const lists = unwrap<any[]>(await this.getLists());
    const list = lists.find((l) => l.label === label);
    expect(list, `list "${label}" not found after create`).toBeTruthy();
    return idOf(list);
  }

  async items(listId: string): Promise<any[]> {
    return unwrap<any>(await this.getList(listId))?.items ?? [];
  }
}

export const uniqueLabel = (prefix = 'lab') => `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
