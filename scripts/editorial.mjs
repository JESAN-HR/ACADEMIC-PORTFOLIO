// Reference-inspired cards. Content remains in src/content/.
export function editorialComponents({ escape, link, links, tags }) {
  const symbols = {
    phone: '<rect x="6" y="2" width="12" height="20" rx="2"/><path d="M11 18h2"/>',
    code: '<path d="M8 3H6v6l-2 3 2 3v6h2M16 3h2v6l2 3-2 3v6h-2"/>',
    desktop: '<rect x="2" y="3" width="20" height="14" rx="2"/><path d="M12 17v4M8 21h8"/>',
    sparkle: '<path d="m12 2 3 7 7 3-7 3-3 7-3-7-7-3 7-3Z"/>',
  };
  const icon = name => `<svg class="card-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" aria-hidden="true">${symbols[name] || symbols.code}</svg>`;
  const researchMark = `<svg class="research-mark" viewBox="0 0 160 160" fill="none" aria-hidden="true"><circle cx="80" cy="80" r="65"/><circle cx="80" cy="80" r="32" opacity=".45"/><circle cx="80" cy="80" r="14" opacity=".35"/><ellipse cx="80" cy="80" rx="65" ry="29" transform="rotate(35 80 80)"/><ellipse cx="80" cy="80" rx="65" ry="29" transform="rotate(-35 80 80)"/><circle cx="80" cy="80" r="6" fill="currentColor" stroke="none"/></svg>`;
  const awardMark = '<svg class="award-mark" viewBox="0 0 40 40" fill="none" stroke="currentColor" stroke-width="1.4" aria-hidden="true"><path d="M20 2v36M2 20h36M7 7l26 26M7 33 33 7"/></svg>';

  return {
    research(items) {
      if (!items.length) return '';
      return `<div class="research-cards">${items.map(r => `<article class="research-card">
        <aside class="research-margin"><p class="eyebrow">${escape(r.dates)}</p>${researchMark}${r.field ? `<p class="eyebrow research-field">${escape(r.field)}</p>` : ''}</aside>
        <div class="research-copy"><p class="research-status">${escape(r.status)}</p><h3>${escape(r.title)}</h3><p>${escape(r.description)}</p>
        ${r.supervisor ? `<div class="research-supervisor"><p class="eyebrow">Supervisor</p><p>${escape(r.supervisor)}</p></div>` : ''}
        ${r.questions?.length ? `<details class="editorial-details"><summary>Questions guiding the study <span aria-hidden="true">↗</span></summary><ol>${r.questions.map(q => `<li>${escape(q)}</li>`).join('')}</ol></details>` : ''}
        ${tags(r.keywords)}<div class="item-links">${links(r)}</div></div></article>`).join('')}</div>`;
    },
    projects(items) {
      const tones = ['blue', 'sage', 'mustard', 'lavender'];
      return items.map((pr, i) => {
        const tone = tones.includes(pr.tone) ? pr.tone : tones[i % tones.length];
        return `<article class="project-item tone-${tone}" data-featured="${Boolean(pr.featured)}">
          <div class="card-meta"><p class="project-category">${escape(pr.category)}</p>${icon(pr.icon)}</div>
          <h3>${escape(pr.title)}</h3>${pr.subtitle ? `<p class="project-subtitle">${escape(pr.subtitle)}</p>` : ''}
          <p class="project-description">${escape(pr.shortDescription)}</p>
          <details class="project-expand editorial-details"><summary><span class="details-label-closed">View details</span><span class="details-label-open">Hide details</span><span class="details-chevron" aria-hidden="true">⌄</span></summary>
          <div class="project-expanded-content">${tags(pr.technologies)}
          ${pr.status ? `<p class="project-status">${escape(pr.status)}</p>` : ''}
          ${pr.fullDescription ? `<p>${escape(pr.fullDescription)}</p>` : ''}${pr.highlights?.length ? `<ul>${pr.highlights.map(h => `<li>${escape(h)}</li>`).join('')}</ul>` : ''}
          <div class="item-links">${links(pr)}</div></div></details></article>`;
      }).join('');
    },
    awards(items) {
      return `<div class="awards-editorial">${items.map(a => `<article class="award-entry">
        <div class="award-margin"><span class="award-date">${escape(a.year)}</span>${awardMark}</div>
        <div class="award-copy"><p class="eyebrow">${escape(a.category)}</p><h3>${escape(a.title)}</h3>
        <p class="award-organization">${escape(a.organization)}</p><p class="award-description">${escape(a.description)}</p>
        <div class="item-links">${link('View certificate', a.proofUrl)}</div></div></article>`).join('')}</div>`;
    },
  };
}
