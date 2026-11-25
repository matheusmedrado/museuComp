import { fetchJSON, frontFace, backFace, applyImage, setText, licenseName } from './cards.js';

function showCredits(entries, credits) {
  const list = document.getElementById('image-credits');
  for (const { id, name } of entries) {
    const credit = credits[id];
    if (!credit) continue;
    const item = document.getElementById('image-credit').content.firstElementChild.cloneNode(true);
    setText(item, '.credit-card', name);
    setText(item, '.credit-author', credit.author);
    setText(item, '.credit-license', licenseName(credit));
    setText(item, '.credit-source', credit.title);
    if (credit.license_url) item.querySelector('.credit-license').href = credit.license_url;
    if (credit.source_url) item.querySelector('.credit-source').href = credit.source_url;
    if (credit.note) {
      setText(item, '.credit-note', credit.note);
      item.querySelector('.credit-note').hidden = false;
    }
    list.append(item);
  }
}

function screenCard(entry, front, back) {
  const item = document.createElement('li');
  item.dataset.category = entry.category;
  item.dataset.search = normalize(`${entry.name} ${entry.clue} ${entry.category}`);
  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'flip';
  back.id = `answer-${entry.id}`;
  button.setAttribute('aria-controls', back.id);

  function show(showBack) {
    back.hidden = !showBack;
    front.hidden = showBack;
    button.setAttribute('aria-expanded', String(showBack));
    button.textContent = showBack ? 'Voltar à frente' : 'Virar carta';
    button.setAttribute('aria-label', `${button.textContent}: ${entry.name}`);
  }
  show(false);
  for (const control of [front, back, button]) {
    control.addEventListener('click', () => show(back.hidden));
  }
  item.append(front, back, button);
  return item;
}

function sheet(cards, side) {
  const page = document.createElement('section');
  page.className = 'print-sheet';
  for (const [index, pair] of cards.entries()) {
    const column = index % 3;
    const card = pair[side];
    card.style.gridRow = 1 + Math.floor(index / 3);
    card.style.gridColumn = side === 'front' ? 1 + column : 3 - column;
    page.append(card);
  }
  return page;
}

async function loadDeck() {
  const initialHash = location.hash;
  document.getElementById('load-error').hidden = true;
  document.getElementById('status').textContent = 'Carregando cartas…';
  const [entries, credits] = await Promise.all([
    fetchJSON('cards.json'),
    fetchJSON('img/cards/credits.json').catch(() => null),
  ]);
  entries.sort((a, b) => a.name.localeCompare(b.name, 'pt-BR'));
  const screen = document.getElementById('deck');
  const print = document.getElementById('print-deck');
  screen.replaceChildren();
  print.replaceChildren();
  document.getElementById('image-credits').replaceChildren();
  const images = [];
  const pairs = entries.map(entry => {
    const front = frontFace(entry);
    const back = backFace(entry);
    const screenFront = front.cloneNode(true);
    screen.append(screenCard(entry, screenFront, back.cloneNode(true)));
    images.push(applyImage(entry, credits?.[entry.id], [screenFront, front]));
    return { front, back };
  });

  for (let i = 0; i < pairs.length; i += 9) {
    const batch = pairs.slice(i, i + 9);
    print.append(sheet(batch, 'front'), sheet(batch, 'back'));
  }

  const drafts = entries.filter(entry => !entry.verified).length;
  const note = drafts ? ` · ${drafts} com ano a confirmar` : '';
  document.getElementById('status').textContent = `${entries.length} cartas${note}`;
  setupFilters(entries, note);
  document.getElementById('credits-status').hidden = true;
  if (credits) {
    showCredits(entries, credits);
  } else {
    const status = document.getElementById('credits-status');
    status.textContent = 'Não foi possível carregar os créditos. As cartas mostram as ilustrações de reserva.';
    status.hidden = false;
  }
  await Promise.all([...images, document.fonts.ready]);
  const button = document.getElementById('print');
  button.disabled = false;
  button.textContent = 'Imprimir baralho ↗';
  document.getElementById('print-status').textContent = 'A4 · frente e verso · baralho completo';
  // The catalog changes the height above deep links after the browser's first scroll.
  if (initialHash && location.hash === initialHash) {
    document.getElementById(initialHash.slice(1))?.scrollIntoView();
  }
}

function normalize(value) {
  return value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLocaleLowerCase('pt-BR');
}

function setupFilters(entries, note) {
  const search = document.getElementById('search');
  const category = document.getElementById('category');
  category.replaceChildren(new Option('Todas as categorias', ''));
  for (const value of [...new Set(entries.map(entry => entry.category))].sort((a, b) => a.localeCompare(b, 'pt-BR'))) {
    category.add(new Option(value, value));
  }
  function filter() {
    const term = normalize(search.value.trim());
    let count = 0;
    for (const item of document.getElementById('deck').children) {
      item.hidden = !item.dataset.search.includes(term) || Boolean(category.value && item.dataset.category !== category.value);
      if (!item.hidden) count++;
    }
    document.getElementById('status').textContent = `${count} de ${entries.length} cartas${note}`;
    document.getElementById('empty-state').hidden = count !== 0;
  }
  search.oninput = filter;
  category.onchange = filter;
  document.getElementById('clear-filters').onclick = () => {
    search.value = '';
    category.value = '';
    filter();
    search.focus();
  };
  document.getElementById('deck-tools').hidden = false;
  filter();
}

function start() {
  loadDeck().catch(() => {
    document.getElementById('status').textContent = 'O baralho não está disponível no momento.';
    document.getElementById('load-error').hidden = false;
    document.getElementById('print-status').textContent = 'Aguardando o carregamento do baralho.';
    document.getElementById('print').textContent = 'Impressão indisponível';
  });
}
document.getElementById('print').addEventListener('click', () => window.print());
document.getElementById('retry').addEventListener('click', start);
start();
