import { fetchJSON, frontFace, backFace, applyImage } from './cards.js';

async function showPreview() {
  const [cards, credits] = await Promise.all([
    fetchJSON('cards.json'),
    fetchJSON('img/cards/credits.json').catch(() => null),
  ]);
  document.getElementById('card-count').textContent = String(cards.length).padStart(2, '0');
  document.querySelector('.hero-facts dd').textContent = 'cartas para descobrir';
  const preview = document.getElementById('hero-cards');
  const sample = [['margaret-hamilton', false], ['margaret-hamilton', true]];
  const entries = sample.map(([id, back]) => [cards.find(card => card.id === id), back]);
  if (entries.some(([card]) => !card)) return;
  preview.replaceChildren();
  for (const [entry, back] of entries) {
    const wrapper = document.createElement('div');
    wrapper.className = 'hero-card';
    const card = back ? backFace(entry) : frontFace(entry);
    if (back) card.setAttribute('aria-label', `${entry.name}, verso: ${entry.year}`);
    wrapper.append(card);
    preview.append(wrapper);
    if (!back) await applyImage(entry, credits?.[entry.id], [card]);
  }
}

showPreview().catch(() => {
  // The page and its links remain useful even if the catalog is unavailable.
});
