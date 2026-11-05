document.querySelectorAll('[data-enhanced]').forEach(el => { el.hidden = false; });
const filters = [...document.querySelectorAll('[data-filter]')];
filters.forEach(filter => filter.addEventListener('change', () => {
  const items = [...document.querySelectorAll('.pub-item')];
  items.forEach(item => { item.hidden = !filters.every(f => !f.value || item.dataset[f.dataset.filter] === f.value); });
  document.querySelector('#publication-empty').hidden = items.some(item => !item.hidden);
}));
document.querySelector('#project-filter')?.addEventListener('change', event => {
  const items = [...document.querySelectorAll('.project-item')];
  items.forEach(item => { item.hidden = event.target.value === 'featured' && item.dataset.featured !== 'true'; });
  document.querySelector('#project-empty').hidden = items.some(item => !item.hidden);
});
const navLinks = [...document.querySelectorAll('.nav-links a')];
if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver(entries => {
    for (const entry of entries) if (entry.isIntersecting) {
      navLinks.forEach(a => {
        if (a.hash === `#${entry.target.id}`) a.setAttribute('aria-current', 'location');
        else a.removeAttribute('aria-current');
      });
    }
  }, { rootMargin: '-15% 0px -65% 0px', threshold: 0 });
  navLinks.forEach(a => { const target = document.querySelector(a.hash); if (target) observer.observe(target); });
}
