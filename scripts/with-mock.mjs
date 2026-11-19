// Runs a command against the local mock unless TWODOS_BASE_URL points at a real environment.
import 'dotenv/config';
import { spawn } from 'node:child_process';

const [cmd, ...args] = process.argv.slice(2);
const useMock = !process.env.TWODOS_BASE_URL;
let mock;
if (useMock) {
  mock = spawn(process.execPath, ['mock/server.mjs'], { stdio: ['ignore', 'pipe', 'inherit'] });
  await new Promise((resolve) => mock.stdout.once('data', (d) => { process.stdout.write(d); resolve(); }));
}
const run = spawn('npx', [cmd, ...args], { stdio: 'inherit', shell: process.platform === 'win32' });
run.on('exit', (code) => { mock?.kill(); process.exit(code ?? 1); });
