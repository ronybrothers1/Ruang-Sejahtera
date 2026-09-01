import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { readFormDataWithinLimit, RequestBodyTooLargeError } from '../lib/security/request-limits.ts';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const source = async (relativePath) => readFile(path.join(root, relativePath), 'utf8');

const membershipPage = await source('app/akun/keanggotaan/page.tsx');
assert.match(membershipPage, /getCurrentExamAttempt/);
assert.doesNotMatch(membershipPage, /getOrCreateExamAttempt/);
assert.match(membershipPage, /intent" value="start/);

const examGuard = await source('components/membership/ExamGuard.tsx');
for (const blockedHandler of ['onCopy', 'onCut', 'onContextMenu', 'onDragStart']) assert.doesNotMatch(examGuard, new RegExp(blockedHandler));
assert.match(examGuard, /milestones = \[600, 300, 60, 10\]/);

const applicationLibrary = await source('lib/program-applications.ts');
assert.match(applicationLibrary, /program_application\.resubmitted/);
assert.match(applicationLibrary, /APPLICATION_TRANSITION_NOT_ALLOWED/);
assert.match(applicationLibrary, /APPLICATION_NOTE_REQUIRED/);
assert.match(await source('app/akun/pengajuan/page.tsx'), /Perbaiki dan kirim ulang/);

assert.match(await source('app/akun/konten/page.tsx'), /Kirim untuk kurasi/);
assert.match(await source('app/api/admin/content/route.ts'), /memberActor/);
assert.match(await source('lib/cms/store.ts'), /prepareMediaForPublication/);
assert.match(await source('lib/security/image-upload.ts'), /sharp\(bytes/);
assert.match(await source('app/api/admin/content/route.ts'), /visibility: 'private'/);

async function apiRouteFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const fullPath = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...await apiRouteFiles(fullPath));
    if (entry.isFile() && entry.name === 'route.ts') files.push(fullPath);
  }
  return files;
}

for (const routeFile of await apiRouteFiles(path.join(root, 'app/api'))) {
  const routeSource = await readFile(routeFile, 'utf8');
  assert.doesNotMatch(routeSource, /request\.formData\(\)/, `${path.relative(root, routeFile)} parses an unbounded form body`);
}

const oversizedRequest = new Request('https://example.test/form', {
  method: 'POST',
  headers: { 'content-type': 'application/x-www-form-urlencoded' },
  body: new ReadableStream({
    start(controller) {
      controller.enqueue(new TextEncoder().encode(`field=${'x'.repeat(128)}`));
      controller.close();
    },
  }),
  duplex: 'half',
});
await assert.rejects(() => readFormDataWithinLimit(oversizedRequest, 64), RequestBodyTooLargeError);

console.log('Competition remediation audit passed: workflow, media privacy, exam start safety, and streamed request limits verified.');
