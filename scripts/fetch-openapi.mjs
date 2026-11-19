// Downloads the published twodos OpenAPI spec to spec/openapi.json.
// The hallucination checker (chapter 1) validates every endpoint used in this repo against it.
import { writeFile, mkdir } from 'node:fs/promises';

const url = process.env.TWODOS_OPENAPI_URL || 'https://twodos.app/openapi.json';
const res = await fetch(url);
if (!res.ok) throw new Error(`Could not download ${url}: HTTP ${res.status}`);
const spec = await res.json();
await mkdir('spec', { recursive: true });
await writeFile('spec/openapi.json', JSON.stringify(spec, null, 2));
console.log(`Saved spec/openapi.json (${Object.keys(spec.paths || {}).length} paths, version ${spec.info?.version})`);
