import { readFile, writeFile, mkdir, copyFile } from 'node:fs/promises';
import { render } from './render.mjs';
const data = JSON.parse(await readFile(new URL('../src/content/portfolio.json', import.meta.url), 'utf8'));
const html = render(data);
await mkdir('dist/assets', { recursive: true });
await writeFile('index.html', html);
await writeFile('dist/index.html', html);
for (const path of ['style.css', 'app.js', 'assets/favicon.svg']) await copyFile(path, `dist/${path}`);
if (data.profile.photo?.startsWith('assets/')) {
  if (data.profile.photo.includes('..')) throw new Error('Use a photo directly inside assets/.');
  await copyFile(data.profile.photo, `dist/${data.profile.photo}`);
}
console.log('Portfolio validated and built in dist/. Root index.html is updated too.');
