import { fetchJSON, frontFace, applyImage } from './cards.js';

const preview = document.getElementById('hero-cards');
const replay = document.getElementById('replay-hero');
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');

async function showPreview() {
  const [cards, credits] = await Promise.all([
    fetchJSON('cards.json'),
    fetchJSON('img/cards/credits.json').catch(() => null),
  ]);
  const entries = ['ada-lovelace', 'eniac', 'margaret-hamilton']
    .map(id => cards.find(card => card.id === id));
  if (entries.some(card => !card)) throw new Error('Preview unavailable');
  entries.sort((a, b) => a.year - b.year);
  preview.replaceChildren();
  const illustrations = [];
  for (const entry of entries) {
    const wrapper = document.createElement('div');
    wrapper.className = 'hero-card';
    wrapper.setAttribute('role', 'img');
    wrapper.setAttribute('aria-label', `${entry.name}, ${entry.year}`);
    const card = frontFace(entry);
    card.setAttribute('aria-hidden', 'true');
    const year = document.createElement('span');
    year.className = 'timeline-year';
    year.textContent = entry.year;
    year.setAttribute('aria-hidden', 'true');
    wrapper.append(card, year);
    preview.append(wrapper);
    illustrations.push([entry, card]);
  }
  // Fixed slots keep the desktop stable while artwork loads. Dates come from cards.json.
  await Promise.all(illustrations.map(([entry, card]) => applyImage(entry, credits?.[entry.id], [card])));
  preview.classList.add('is-animated');
  replay.hidden = reducedMotion.matches;
}

showPreview().catch(() => {
  preview.replaceChildren();
  const fallback = document.createElement('p');
  fallback.className = 'preview-loading';
  fallback.textContent = 'Encontre as cartas no ícone Baralho.';
  preview.append(fallback);
});

// A single, finite sequence: cards shuffle, find their place, then reveal their dates.
replay.addEventListener('click', () => {
  for (const animation of preview.getAnimations({ subtree: true })) {
    animation.currentTime = 0;
    animation.play();
  }
});
reducedMotion.addEventListener('change', () => {
  replay.hidden = reducedMotion.matches || !preview.classList.contains('is-animated');
});
document.addEventListener('visibilitychange', () => preview.classList.toggle('is-paused', document.hidden));
