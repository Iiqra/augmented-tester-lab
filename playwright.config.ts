import { defineConfig } from '@playwright/test';
import 'dotenv/config';

// API-only configuration: twodos has no web app yet, so the public REST API
// is the most direct surface to practise automation against.
// If TWODOS_BASE_URL is empty, tests run against the local mock (see mock/).
const baseURL = process.env.TWODOS_BASE_URL || `http://localhost:${process.env.MOCK_PORT || 4010}`;

export default defineConfig({
  testDir: './chapters',
  testMatch: '**/*.spec.ts',
  fullyParallel: false,
  workers: 1,               // shared account: keep runs sequential
  retries: 0,               // never hide flakiness behind retries while practising
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL,
    extraHTTPHeaders: { Accept: 'application/json' },
  },
});
