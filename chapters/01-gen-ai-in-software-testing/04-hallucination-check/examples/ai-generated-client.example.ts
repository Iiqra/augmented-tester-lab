// CONSTRUCTED EXAMPLE for exercise 04: plausible AI-style output with invented endpoints.
// Not part of the test suite. Run: npm run ch1:check-endpoints -- --examples
import type { APIRequestContext } from '@playwright/test';

export class TwodosClient {
  private request: APIRequestContext;
  private token: string;
  constructor(request: APIRequestContext, token: string) { this.request = request; this.token = token; }
  private h() { return { headers: { Authorization: `Bearer ${this.token}` } }; }

  getLists() { return this.request.get('/api/todos', this.h()); }                                                   // real
  addTask(listId: string, title: string) { return this.request.post(`/api/todos/${listId}`, { ...this.h(), data: { title, done: false } }); } // real
  shareList(listId: string, email: string) { return this.request.post(`/api/todos/${listId}/share`, { ...this.h(), data: { email } }); }   // invented
  completeTask(listId: string, itemId: string) { return this.request.put(`/api/todos/${listId}/${itemId}/complete`, this.h()); }           // invented
  searchTasks(q: string) { return this.request.get(`/api/tasks/search?q=${q}`, this.h()); }                                               // invented
}
