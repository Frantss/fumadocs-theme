import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { cp, mkdtemp, readFile, readdir, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import test from 'node:test';

const root = fileURLToPath(new URL('../', import.meta.url));

function npm(args, cwd) {
  const result = spawnSync('npm', args, {
    cwd,
    encoding: 'utf8',
    timeout: 180_000,
    maxBuffer: 10 * 1024 * 1024,
    stdio: ['ignore', 'pipe', 'pipe'],
  });
  const output = `${result.stdout ?? ''}\n${result.stderr ?? ''}`;
  if (result.error || result.status !== 0) {
    throw new Error(`npm ${args.join(' ')} failed\n${output}`, { cause: result.error });
  }
  return output;
}

test('the packed theme renders documentation with TanStack Start and Nitro', async () => {
  const directory = await mkdtemp(join(tmpdir(), 'fumadocs-theme-ssr-'));

  try {
    npm(['pack', '--pack-destination', directory], root);
    const tarball = (await readdir(directory)).find(name => name.endsWith('.tgz'));
    assert.ok(tarball, 'npm pack must produce a package tarball');

    const fixture = join(directory, 'app');
    await cp(new URL('./fixtures/tanstack-start/', import.meta.url), fixture, { recursive: true });
    npm(['ci', '--no-audit', '--no-fund'], fixture);
    npm(['install', '--no-save', '--no-audit', '--no-fund', join(directory, tarball)], fixture);

    const output = npm(['run', 'build'], fixture);
    const renderingErrors = output
      .split('\n')
      .filter(line => /Error in renderToReadableStream|FrameworkProvider|Error during prerender/i.test(line));
    assert.deepEqual(renderingErrors, [], 'the build must not report server rendering errors');

    const html = await readFile(join(fixture, '.output/public/index.html'), 'utf8');
    assert.match(html, /<h1\b[^>]*>SSR integration fixture<\/h1>/);
    assert.match(html, /Packed theme content renders on the server\./);
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
});
