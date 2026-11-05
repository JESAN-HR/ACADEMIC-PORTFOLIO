import { resolveProfile, resolveEducation } from './profile.mjs';
export const escape = (value = '') => String(value).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
export const visible = items => [...items].filter(x => x.visible !== false).sort((a, b) => (a.displayOrder ?? 999) - (b.displayOrder ?? 999) || (b.year ?? 0) - (a.year ?? 0));
const safeUrl = url => /^(https?:\/\/|mailto:|assets\/)/.test(url ?? '') ? escape(url) : '';
const link = (label, url) => safeUrl(url) ? `<a href="${safeUrl(url)}"${/^https?:/.test(url) ? ' target="_blank" rel="noopener noreferrer"' : ''}>${escape(label)}</a>` : '';
const links = item => Object.entries({ paperUrl: 'Paper', pdfUrl: 'PDF', codeUrl: 'Code', datasetUrl: 'Dataset', supplementaryUrl: 'Supplement', repositoryUrl: 'Repository', liveUrl: 'Website', playStoreUrl: 'Google Play', documentationUrl: 'Documentation', proofUrl: 'Certificate' }).map(([key, label]) => link(label, item[key])).filter(Boolean).join('');
const empty = label => `<p class="empty-state">No ${label} to display at present.</p>`;
const tags = items => items?.length ? `<p class="tags">${items.map(x => `<span>${escape(x)}</span>`).join('')}</p>` : '';
const sectionLabels = {
  about: 'Introduction', research: 'Areas of inquiry', 'current-research': 'On the research desk',
  publications: 'Academic work', projects: 'Selected engineering', education: 'Academic journey',
  awards: 'Recognition', competitions: 'Practice & participation', skills: 'A growing toolkit',
};
const section = (id, title, body) => `<section id="${id}" class="section" aria-labelledby="${id}-title"><header class="section-heading"><p class="eyebrow">${sectionLabels[id] || ''}</p><h2 id="${id}-title">${title}</h2></header>${body}</section>`;

export function validate(data) {
  for (const key of ['name', 'shortName', 'initials', 'role', 'affiliation', 'location', 'email']) {
    if (typeof data.profile?.[key] !== 'string' || !data.profile[key].trim()) throw new Error(`profile.${key}: enter a non-empty text value.`);
  }
  if (!Array.isArray(data.profile.about)) throw new Error('profile.about must be a list of paragraphs.');
  const requiredText = {
    education: ['dates', 'organization', 'description'],
    achievements: ['organization', 'description'],
    researchProjects: ['dates', 'status', 'description'],
    competitions: ['organization', 'status', 'description'],
  };
  for (const key of ['socialLinks', 'education', 'researchInterests', 'researchProjects', 'publications', 'projects', 'achievements', 'skills', 'competitions']) {
    if (!Array.isArray(data[key])) throw new Error(`${key} must be a list.`);
    const ids = new Set();
    for (const item of data[key]) {
      if (key !== 'socialLinks' && (!item.id || ids.has(item.id))) throw new Error(`${key}: each item needs a unique id.`);
      ids.add(item.id);
      if (typeof item[key === 'socialLinks' ? 'label' : 'title'] !== 'string') throw new Error(`${key}: each item needs a text title/label.`);
      for (const field of requiredText[key] || []) {
        if (typeof item[field] !== 'string' || !item[field].trim()) throw new Error(`${key}.js → ${item.id} → ${field}: fill in this text field.`);
      }
      if (item.displayOrder !== undefined && (!Number.isInteger(item.displayOrder) || item.displayOrder < 0)) throw new Error(`${key}.js → ${item.id}: displayOrder must be a nonnegative whole number.`);
      if ('year' in item && !Number.isInteger(item.year)) throw new Error(`${key}.js → ${item.id}: year must be a whole number.`);
      if ('visible' in item && typeof item.visible !== 'boolean') throw new Error(`${key}.${item.id}: visible must be true or false.`);
      for (const [field, value] of Object.entries(item)) {
        if ((field.endsWith('Url') || field === 'url') && value && !safeUrl(value)) throw new Error(`${key}.${item.id ?? item.label}.${field}: use an https:// URL or assets/ path.`);
      }
      for (const field of ['technologies', 'keywords', 'questions', 'topics', 'items']) {
        if (field in item && (!Array.isArray(item[field]) || item[field].some(v => typeof v !== 'string'))) throw new Error(`${key}.${item.id}.${field}: use a list of text values.`);
      }
    }
  }
  for (const contest of data.competitions) {
    if (!Array.isArray(contest.rounds)) throw new Error(`competitions.js → ${contest.id}: rounds must be a list.`);
    for (const round of contest.rounds) {
      if (!Number.isInteger(round.rank) || round.rank < 1 || !Number.isInteger(round.solved) || round.solved < 0) throw new Error(`competitions.js → ${contest.id}: use a positive rank and nonnegative solved count.`);
      if (round.standingsUrl && !safeUrl(round.standingsUrl)) throw new Error(`competitions.js → ${contest.id}: use an https:// standings URL.`);
    }
  }
  for (const p of data.publications) {
    if (!Array.isArray(p.authors) || p.authors.some(a => typeof a.name !== 'string' || typeof a.isMe !== 'boolean')) throw new Error(`publications.${p.id}.authors: use objects with name and isMe.`);
    if (!Number.isInteger(p.year)) throw new Error(`publications.${p.id}.year: enter a whole-number year.`);
    if (p.authorsVerified && !p.authors.length) throw new Error(`publications.${p.id}: add the verified author list first.`);
  }
}

export function render(data, { cvAvailable = false } = {}) {
  validate(data);
  const p = resolveProfile(data.profile);
  const navigation = [['about', 'About'], ['research', 'Research'], ['publications', 'Publications'], ['education', 'Education'], ['projects', 'Projects'], ['awards', 'Awards'], ['competitions', 'Activities'], ['skills', 'Skills'], ['contact', 'Contact']];
  const publications = visible(data.publications);
  const filter = (key, label) => `<label>${label}<select data-filter="${key}"><option value="">All ${label.toLowerCase()}s</option>${[...new Set(publications.map(p => p[key]).filter(Boolean))].map(v => `<option value="${escape(v)}">${escape(v)}</option>`).join('')}</select></label>`;
  const body = [
    section('about', 'About Me', p.about.map(x => `<p>${escape(x)}</p>`).join('') + (p.applicationSummary ? `<aside class="research-fit" aria-label="Graduate research interests"><p class="eyebrow">Prospective supervision</p><p>${escape(p.applicationSummary)}</p><a href="mailto:${escape(p.email)}">Discuss research fit ↗</a></aside>` : '')),
    section('research', 'Research Interests', `<div class="interest-list">${visible(data.researchInterests).map(i => `<details class="interest-item"><summary>${escape(i.title)}</summary><p>${i.topics.map(escape).join(' · ')}</p></details>`).join('') || empty('research interests')}</div>${p.secondaryInterests?.length ? `<p class="secondary-interests">Other interests: ${p.secondaryInterests.map(escape).join(' · ')}</p>` : ''}`),
    section('publications', 'Selected Publications', `${publications.length ? `<div class="filters" data-enhanced hidden>${filter('year', 'Year')}${filter('type', 'Type')}${filter('domain', 'Domain')}</div>` : ''}<div class="pub-list">${publications.map(pub => `<article class="pub-item" data-year="${escape(pub.year)}" data-type="${escape(pub.type)}" data-domain="${escape(pub.domain)}"><div class="pub-info"><h3>${escape(pub.title)}</h3>${pub.authorsVerified ? `<p class="pub-authors">${pub.authors.map(a => a.isMe ? `<strong>${escape(a.name)}</strong>` : escape(a.name)).join(', ')}</p>` : `<p class="pub-authors"><strong>${escape(p.name)}</strong> — ${escape(pub.contribution)}</p>`}<p class="pub-venue">${escape(pub.status)} — ${escape(pub.venue)}, ${escape(pub.year)}</p><p class="pub-description">${escape(pub.description)}</p><div class="item-links">${links(pub)}${pub.doi ? link('DOI', `https://doi.org/${pub.doi}`) : ''}</div>${pub.abstract ? `<details><summary>Abstract</summary><p>${escape(pub.abstract)}</p></details>` : ''}</div></article>`).join('') || empty('publications')}</div><p id="publication-empty" class="empty-state" role="status" hidden>No publications match these filters.</p>`),
    section('current-research', 'Research in Progress', `<div class="timeline">${visible(data.researchProjects).map(r => `<article class="timeline-item"><div class="timeline-date">${escape(r.dates)}</div><div class="timeline-content"><h3>${escape(r.title)}</h3><p class="status">${escape(r.status)}</p>${r.supervisor ? `<p class="org">Supervisor: ${escape(r.supervisor)}</p>` : ''}<p>${escape(r.description)}</p>${r.questions?.length ? `<details><summary>Research questions</summary><ul>${r.questions.map(q => `<li>${escape(q)}</li>`).join('')}</ul></details>` : ''}${tags(r.keywords)}<div class="item-links">${links(r)}</div></div></article>`).join('') || empty('ongoing research projects')}</div>`),
    section('education', 'Education', `<div class="timeline">${visible(resolveEducation(data.education, p)).map(e => `<article class="timeline-item"><div class="timeline-date">${escape(e.dates)}</div><div class="timeline-content"><h3>${escape(e.title)}</h3><p class="org">${escape(e.organization)}</p><p>${escape(e.description)}</p></div></article>`).join('') || empty('education entries')}</div>`),
    section('projects', 'Projects', `<div class="filters" data-enhanced hidden><label>Show<select id="project-filter"><option value="all">All projects</option><option value="featured">Featured projects</option></select></label></div><div class="project-list">${visible(data.projects).map(pr => `<article class="project-item" data-featured="${Boolean(pr.featured)}"><p class="project-category">${escape(pr.category)}${pr.featured ? ' · Featured' : ''}</p><h3>${escape(pr.title)}</h3><p>${escape(pr.shortDescription)}</p>${tags(pr.technologies)}${pr.fullDescription || pr.highlights?.length ? `<details class="project-notes"><summary>Project notes</summary>${pr.fullDescription ? `<p>${escape(pr.fullDescription)}</p>` : ''}${pr.highlights?.length ? `<ul>${pr.highlights.map(h => `<li>${escape(h)}</li>`).join('')}</ul>` : ''}</details>` : ''}<div class="item-links">${links(pr)}</div></article>`).join('') || empty('projects')}</div><p id="project-empty" class="empty-state" role="status" hidden>No featured projects to display at present.</p>`),
    section('awards', 'Honors &amp; Awards', `<ul class="awards-list">${visible(data.achievements).map(a => `<li><span class="award-year">${escape(a.year)}</span> <strong>${escape(a.title)}</strong><p>${escape(a.organization)}<br>${escape(a.description)}</p><div class="item-links">${links(a)}</div></li>`).join('')}</ul>${!visible(data.achievements).length ? empty('awards') : ''}`),
    section('competitions', 'Competitions &amp; Activities', `<div class="timeline">${visible(data.competitions).map(c => `<article class="timeline-item"><div class="timeline-date">${escape(c.year)}<br><span class="status">${escape(c.status)}</span></div><div class="timeline-content"><h3>${escape(c.title)}</h3><p class="org">${escape(c.organization)}</p><p>${escape(c.description)}</p><ul class="contest-rounds">${c.rounds.map(r => `<li><strong>${escape(r.label)}</strong> · ${escape(r.date)}<br>Rank ${escape(r.rank)} · ${escape(r.solved)} ${r.solved === 1 ? 'problem' : 'problems'} solved<br>${link('View standings', r.standingsUrl)}</li>`).join('')}</ul></div></article>`).join('') || empty('competition entries')}</div>`),
    section('skills', 'Skills', `<div class="skills-grid">${visible(data.skills).map(s => `<div class="skill-category"><h3>${escape(s.title)}</h3><p>${s.items.map(escape).join(', ')}</p></div>`).join('') || empty('skill groups')}</div>`)
  ].join('\n');
  return `<!DOCTYPE html>
<html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${escape(p.name)} — Academic Portfolio</title><meta name="description" content="${escape(p.name)} — ${escape(p.role)}. ${escape(p.interests)}.">
<meta property="og:title" content="${escape(p.name)} — Academic Portfolio"><meta property="og:description" content="${escape(p.role)}. ${escape(p.interests)}."><meta property="og:type" content="website"><meta name="theme-color" content="#F0EFE7">
<link rel="icon" href="assets/favicon.svg" type="image/svg+xml"><link rel="stylesheet" href="style.css"><link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=Source+Sans+3:wght@400;600;700&family=Source+Serif+4:wght@600;700&display=swap" rel="stylesheet"><script src="app.js" defer></script></head>
<body><a class="skip-link" href="#main">Skip to content</a><nav class="navbar" aria-label="Main navigation"><div class="nav-content"><a class="nav-logo" href="#home">${escape(p.shortName)}<span aria-hidden="true">.</span></a><div class="nav-links">${navigation.map(([id, name]) => `<a href="#${id}">${name}</a>`).join('')}</div></div></nav>
<header id="home" class="hero"><div class="hero-content"><div class="hero-photo">${p.photo && safeUrl(p.photo) ? `<img src="${safeUrl(p.photo)}" alt="${escape(p.name)}" width="150" height="150">` : `<div class="photo-placeholder" aria-label="${escape(p.name)} initials">${escape(p.initials)}</div>`}</div><div class="hero-text"><p class="eyebrow">Academic &amp; research portfolio</p><h1>${escape(p.name)}</h1><p class="hero-role">${escape(p.role)}</p><p class="hero-interests">${escape(p.interests)}</p>${p.introduction ? `<p class="hero-intro">${escape(p.introduction)}</p>` : ''}<p class="hero-affiliation">${escape(p.affiliation)}</p><p class="hero-location">${escape(p.location)}</p>${p.applicationFocus ? `<p class="application-focus">${escape(p.applicationFocus)}</p>` : ''}<div class="hero-actions"><a class="button-primary" href="#publications">View publications <span aria-hidden="true">↗</span></a>${cvAvailable ? `<a class="button-cv" href="${escape(p.cvUrl)}" download="Jesan-Academic-CV.pdf">Download CV <span aria-hidden="true">↓</span></a>` : '<button class="button-cv" type="button" disabled aria-describedby="cv-status">Download CV <span aria-hidden="true">↓</span></button>'}<a class="button-research" href="#current-research">Explore research <span aria-hidden="true">↗</span></a></div>${!cvAvailable ? '<p id="cv-status" class="cv-status">CV will be available soon.</p>' : ''}<div class="hero-links">${link('Email', `mailto:${p.email}`)}${visible(data.socialLinks).filter(s => s.showInHero !== false).map(s => link(s.label, s.url)).join('')}</div></div></div></header>
<main id="main">${body}</main><footer id="contact" class="footer"><p class="eyebrow">Get in touch</p><h2>Let’s start a conversation.</h2><p>Email: ${link(p.email, `mailto:${p.email}`)}</p><p>${escape(p.location)}</p>${p.contactText ? `<p>${escape(p.contactText)}</p>` : ''}<div class="contact-links">${visible(data.socialLinks).map(s => link(s.label, s.url)).join('')}</div><p class="footer-note">&copy; ${new Date().getUTCFullYear()} ${escape(p.name)}.</p></footer></body></html>\n`;
}
