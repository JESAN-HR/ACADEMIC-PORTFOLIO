import test from 'node:test';
import assert from 'node:assert/strict';
import seed from '../src/content/index.js';
import { readFileSync } from 'node:fs';
import { render, validate } from './render.mjs';
import { resolveProfile } from './profile.mjs';
test('personal content, hidden research, and internal links', () => {
  const html = render(seed);
  assert.match(html, /MD Habibur Rahman Jesan/);
  assert.match(html, /Co-author \(fourth author\)/);
  assert.match(html, /Undergraduate thesis/);
  assert.match(html, /src="assets\/profile.jpg"/);
  assert.match(html, /MAYA AI/);
  assert.match(html, /Victory Day Quiz/);
  assert.match(html, /Rank 67/);
  assert.doesNotMatch(html, /Boise State|5,000|verificationNotes|Provisional investigation/);
  assert.doesNotMatch(html, /href=""/);
  const ids = new Set([...html.matchAll(/\bid="([^"]+)"/g)].map(m => m[1]));
  for (const match of html.matchAll(/href="#([^"]+)"/g)) assert.ok(ids.has(match[1]), match[1]);
});
test('new entries, visibility, author order and optional links', () => {
  const d = structuredClone(seed);
  d.publications.push({ ...d.publications[0], id: 'new-paper', title: 'New <Paper>', authorsVerified: true, authors: [{ name: 'First Author', isMe: false }, { name: 'Jesan', isMe: true }], paperUrl: 'https://example.com/paper' });
  d.projects.push({ id: 'new-project', title: 'New project', visible: true });
  d.achievements.push({ id: 'new-award', title: 'New award', organization: 'Organizer', description: 'Award details', year: 2027 });
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

test('education and achievements can be added, ordered and hidden', () => {
  const data = structuredClone(seed);
  data.education.push({ id: 'future-entry', title: 'Example qualification', organization: 'Example university', dates: '2028', description: 'Example only', displayOrder: 0, visible: true });
  const html = render(data);
  assert.ok(html.indexOf('Example qualification') < html.indexOf('<h3>B.Sc.'));
  data.education.at(-1).visible = false;
  assert.doesNotMatch(render(data), /Example qualification/);
  data.education.at(-1).organization = '';
  assert.throws(() => validate(data), /education.js.*organization/);
});

test('copy-and-fill templates work in every collection', () => {
  for (const key of ['education', 'achievements', 'projects', 'publications', 'researchProjects', 'researchInterests', 'skills', 'competitions', 'socialLinks', 'experience', 'training']) {
    const source = readFileSync(new URL(`../src/content/${key}.js`, import.meta.url), 'utf8');
    const comment = source.slice(source.indexOf('/* COPY THIS ENTRY'));
    const template = JSON.parse(comment.slice(comment.indexOf('{'), comment.lastIndexOf('}') + 1));
    const data = structuredClone(seed);
    data[key].push(template);
    assert.doesNotThrow(() => render(data), key);
    if (key !== 'socialLinks') {
      assert.doesNotMatch(render(data), new RegExp(template.id));
      template.visible = true;
      assert.doesNotThrow(() => render(data), `${key} visible template`);
    }
  }
});

test('graduate mode updates public biography, education and search metadata', () => {
  const data = structuredClone(seed);
  data.profile.careerStage = 'graduate';
  assert.throws(() => resolveProfile(data.profile), /graduationDate/);
  data.profile.graduationDate = 'December 2027';
  const html = render(data);
  assert.match(html, /Computer Science Graduate/);
  assert.match(html, /Seeking research-focused MSc \/ PhD opportunities/);
  assert.match(html, /Completed December 2027/);
  assert.doesNotMatch(html, /Expected graduation: December 2027/);
  assert.doesNotMatch(html, /content="[^"]*CSE undergraduate/);
  assert.match(html, /Undergraduate thesis/); // Research status stays independently editable.
});

test('CV action has a real download only when a PDF is available', () => {
  const available = render(seed, { cvAvailable: true });
  assert.match(available, /href="cv\/JESAN.pdf" download="Jesan-Academic-CV.pdf"/);
  const absent = render(seed, { cvAvailable: false });
  assert.match(absent, /disabled aria-describedby="cv-status"/);
  assert.doesNotMatch(absent, /href="cv\/JESAN.pdf"/);
});

test('multiple papers render before current research and education', () => {
  const data = structuredClone(seed);
  for (let i = 2; i <= 4; i++) data.publications.push({ ...data.publications[0], id: `test-paper-${i}`, title: `Test paper ${i}`, displayOrder: i });
  const html = render(data);
  assert.equal((html.match(/class="pub-item"/g) || []).length, 4);
  assert.ok(html.indexOf('<section id="publications"') < html.indexOf('<section id="current-research"'));
  assert.ok(html.indexOf('<section id="education"') < html.indexOf('<section id="projects"'));
});

test('experience visibility is configurable; training stays separate', () => {
  const data = structuredClone(seed);
  assert.match(render(data), /XX Position — Example 1/);
  assert.match(render(data), /XX Position — Example 2/);
  data.experience.forEach(item => { item.visible = false; });
  const initial = render(data);
  assert.doesNotMatch(initial, /id="experience"|href="#experience"/);
  assert.match(initial, /Student Participant — Advanced ML &amp; DL Bootcamp/);
  assert.match(initial, /Instructor: SM Shaqib/);
  assert.doesNotMatch(initial, /Trainer, Advanced|Trained more than 30|Research Assistant/);
  data.experience.push({ id: 'test-ra', title: 'Research Assistant', organization: 'Test Lab', dates: 'Example dates', description: 'Example duties', highlights: ['Example contribution'], visible: true });
  const populated = render(data);
  assert.match(populated, /href="#experience"/);
  assert.ok(populated.indexOf('<section id="current-research"') < populated.indexOf('<section id="experience"'));
  assert.ok(populated.indexOf('<section id="experience"') < populated.indexOf('<section id="education"'));
  assert.match(populated, /Example contribution/);
  data.experience.forEach(item => { item.visible = false; });
  data.training.forEach(item => { item.visible = false; });
  assert.doesNotMatch(render(data), /id="experience"|href="#experience"|id="training"|href="#training"/);
});
