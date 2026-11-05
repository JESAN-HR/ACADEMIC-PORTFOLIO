import test from 'node:test';

import assert from 'node:assert/strict';

import { readFileSync } from 'node:fs';

import { render, validate } from './render.mjs';

const seed = JSON.parse(readFileSync(new URL('../src/content/portfolio.json', import.meta.url), 'utf8'));

test('personal content, hidden research, and internal links', () => {

  const html = render(seed);

  assert.match(html, /MD Habibur Rahman Jesan/);

  assert.match(html, /Co-author \(fourth author\)/);

  assert.match(html, /Undergraduate thesis/);

  assert.match(html, /src="assets\/profile.jpg"/);

  assert.match(html, /MAYA AI/);

  assert.match(html, /Victory Day Quiz/);

  assert.match(html, /Rank 67/);

  assert.doesNotMatch(html, /SM Shaqib|Boise State|5,000|verificationNotes|Provisional investigation/);

  assert.doesNotMatch(html, /href=""/);

  const ids = new Set([...html.matchAll(/\bid="([^"]+)"/g)].map(m => m[1]));

  for (const match of html.matchAll(/href="#([^"]+)"/g)) assert.ok(ids.has(match[1]), match[1]);

});

test('new entries, visibility, author order and optional links', () => {

  const d = structuredClone(seed);

  d.publications.push({ ...d.publications[0], id: 'new-paper', title: 'New <Paper>', authorsVerified: true, authors: [{ name: 'First Author', isMe: false }, { name: 'Jesan', isMe: true }], paperUrl: 'https://example.com/paper' });

  d.projects.push({ id: 'new-project', title: 'New project', visible: true });

  d.achievements.push({ id: 'new-award', title: 'New award', year: 2027 });

  d.projects[0].visible = false;

  const html = render(d);

  assert.match(html, /First Author, <strong>Jesan<\/strong>/);

  assert.match(html, /New &lt;Paper&gt;/);

  assert.match(html, /href="https:\/\/example.com\/paper"/);

  assert.match(html, /New project/);

  assert.match(html, /New award/);

  assert.doesNotMatch(html, /Smart Academic Task Manager/);

});

test('all collections can be empty', () => {

  const d = structuredClone(seed);

  for (const key in d) if (Array.isArray(d[key])) d[key] = [];

  assert.match(render(d), /No publications to display/);

  assert.match(render(d), /No projects to display/);

});

test('invalid data produces actionable errors', () => {

  const d = structuredClone(seed);

  d.publications[0].authorsVerified = true;

  assert.throws(() => validate(d), /verified author list/);

  d.publications[0].authorsVerified = false;

  d.projects[0].repositoryUrl = 'javascript:alert(1)';

  assert.throws(() => validate(d), /https/);

});

