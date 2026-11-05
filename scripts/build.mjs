import { writeFile, mkdir, copyFile, readFile, rm } from 'node:fs/promises';
import { render } from './render.mjs';
import data from '../src/content/index.js';
const cvUrl = data.profile.cvUrl || '';
let cvAvailable = /^https:\/\//.test(cvUrl);
if (cvUrl && !cvAvailable && cvUrl !== 'cv/JESAN.pdf') {
  throw new Error('profile.js → cvUrl: use cv/JESAN.pdf or a full https:// PDF URL.');
}
if (cvUrl === 'cv/JESAN.pdf') {
  try {
    const pdf = await readFile(cvUrl);
    if (pdf.subarray(0, 5).toString() !== '%PDF-') throw new Error('cv/JESAN.pdf must be a real PDF, not a renamed text file.');
    cvAvailable = true;
  } catch (error) {
    if (error.code !== 'ENOENT') throw error;
    console.log('CV not added yet. Drop JESAN.pdf in cv/ and rebuild to enable its download.');
  }
}
const html = render(data, { cvAvailable });
await mkdir('dist/assets', { recursive: true });
await writeFile('index.html', html);
await writeFile('dist/index.html', html);
for (const path of ['style.css', 'app.js', 'assets/favicon.svg']) await copyFile(path, `dist/${path}`);
await mkdir('dist/cv', { recursive: true });
if (cvAvailable && cvUrl === 'cv/JESAN.pdf') await copyFile(cvUrl, 'dist/cv/JESAN.pdf');
else await rm('dist/cv/JESAN.pdf', { force: true });
if (data.profile.photo?.startsWith('assets/')) {
  if (data.profile.photo.includes('..')) throw new Error('Use a photo directly inside assets/.');
  await copyFile(data.profile.photo, `dist/${data.profile.photo}`);
}
console.log('Portfolio validated and built in dist/. Root index.html is updated too.');
