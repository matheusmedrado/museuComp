const svgNS = 'http://www.w3.org/2000/svg';
const levels = { 'Fácil': 1, 'Média': 2, 'Difícil': 3 };
const glyphs = {
  pascalina: 'M31 29h98v41H31z M39 35h82v15H39z M48 59h8m10 0h8m10 0h8m10 0h8',
  'ada-lovelace': 'M42 20h55l21 20v38H42z M97 20v22h21 M53 35h28m-28 12h35m-35 12h19m8 0h27m-54 10h54',
  'alan-turing': 'M25 39h110v25H25z M47 39v25m22-25v25m22-25v25m22-25v25 M73 28h14l-7 8z M95 49h14m-59 0h14m33 6h10',
  eniac: 'M28 23h104v52H28z M62 23v52m36-52v52 M37 34h16m-16 12h16m-16 12h16m18-24h18m-18 12h18m-18 12h18m18-24h16m-16 12h16m-16 12h16',
  transistor: 'M80 36a19 19 0 1 0 .01 0 M61 55H38m28-10 49-23m-49 43 49 14m-22-13 10 9-14 1 M65 44v23',
  zezinho: 'M34 30h92v44H34z M43 39h34v25H43z M86 42h30m-30 10h13m5 0h12m-30 10h30 M48 49h19v5H48z',
  mouse: 'M81 29c-5-17 26-7 24-18 M57 53c0-13 9-24 23-24s23 11 23 24v10c0 12-9 18-23 18s-23-6-23-18z M57 50h46M80 29v21',
  'margaret-hamilton': 'M61 36a11 11 0 1 0 .01 0 M42 78V68c0-8 8-12 19-12s19 4 19 12v10z M90 30h28v10H90z M94 40h32v12H94z M89 52h32v13H89z M94 65h33v13H94z',
  'intel-4004': 'M58 29h44v44H58z M67 38h26v26H67z M46 37h12m-12 10h12m-12 10h12m-12 10h12m44-30h12m-12 10h12m-12 10h12m-12 10h12 M68 18v11m12-11v11m12-11v11m-24 44v11m12-11v11m12-11v11',
  'patinho-feio': 'M29 34h102v39H29z M73 34v39M38 42h27v15H38z M38 65h27m17-20h11m5 0h11m5 0h10m-42 9h11m5 0h11m5 0h10m-42 9h11m5 0h11m5 0h10',
  lncc: 'M80 23L40 70h80z M80 15a8 8 0 1 0 .01 0 M40 62a8 8 0 1 0 .01 0 M120 62a8 8 0 1 0 .01 0',
  web: 'M80 24a26 26 0 1 0 .01 0 M54 50h52m-26-26c-17 12-17 40 0 52m0-52c17 12 17 40 0 52 M34 42h13m67 16h13',
  lua: 'M90 25a25 25 0 1 0 17 32C86 62 77 42 90 25z M111 24v13m-7-7h14 M48 39l-10 8 10 8m68 9 8 7-8 7',
  'urna-eletronica': 'M36 31h88v42H36z M44 39h33v18H44z M86 40h7m6 0h7m6 0h6m-32 8h7m6 0h7m6 0h6m-32 8h7m6 0h7m6 0h6m-32 9h32',
  google: 'M34 39h92v23H34z M111 44a5 5 0 1 0 .01 0m3 9 6 5 M44 50h40 M47 69h58',
  iphone: 'M63 20h34v64H63z M67 28h26v43H67z M76 77h8 M75 24h10',
  pix: 'M54 52l21-21 5 5 5-5 21 21-21 21-5-5-5 5z M59 48h12l9 9 9-9h12m-42 8h12l9-9 9 9h12',
  chatgpt: 'M39 32h82v36H77l-17 12V68H39z M53 44h55m-55 7h43m-43 7h36',
};

function svgElement(tag, attributes) {
  const element = document.createElementNS(svgNS, tag);
  for (const [key, value] of Object.entries(attributes)) element.setAttribute(key, value);
  return element;
}

function ditherPath() {
  const dots = [];
  for (let y = 0; y < 90; y += 3) {
    for (let x = ((y / 3) % 2) * 3; x < 160; x += 6) {
      const size = (.5 + Math.max(0, 1 - (x / 160) - (y / 180))).toFixed(1);
      dots.push(`M${x} ${y}h${size}v${size}h-${size}z`);
    }
  }
  return dots.join('');
}

const texture = ditherPath();

function artwork(id) {
  const svg = svgElement('svg', { viewBox: '0 0 160 90', preserveAspectRatio: 'xMidYMid slice', 'aria-hidden': 'true' });
  svg.append(
    svgElement('rect', { width: 160, height: 90, fill: '#b3f2f8' }),
    svgElement('circle', { cx: 80, cy: 50, r: 37, fill: '#83d7e7' }),
    svgElement('path', {
      d: glyphs[id] || 'M45 38l-15 15 15 15m70-30 15 15-15 15M92 27 67 77',
      fill: 'none', stroke: '#084557', 'stroke-width': 3, 'stroke-linecap': 'round', 'stroke-linejoin': 'round',
    }),
    svgElement('path', { d: texture, fill: '#05536a', opacity: .35 }),
  );
  return svg;
}

function face(side) {
  return document.getElementById(side).content.firstElementChild.cloneNode(true);
}

function setText(card, selector, value) {
  card.querySelector(selector).textContent = value;
}

function frontFace(entry) {
  const card = face('front');
  setText(card, '.name', entry.name);
  setText(card, '.clue', entry.clue);
  setText(card, '.category', entry.category);
  setText(card, '.level', entry.difficulty);
  card.querySelector('.art').append(artwork(entry.id));
  for (let i = 0; i < 3; i++) {
    const pip = document.createElement('i');
    if (i < levels[entry.difficulty]) pip.className = 'on';
    card.querySelector('.pips').append(pip);
  }
  return card;
}

function backFace(entry, start, end) {
  const card = face('back');
  setText(card, '.year', entry.year);
  setText(card, '.name', entry.name);
  setText(card, '.event', entry.event);
  setText(card, '.start', start);
  setText(card, '.end', end);
  card.querySelector('.track i').style.left = `${start === end ? 50 : 100 * (entry.year - start) / (end - start)}%`;
  card.querySelector('.draft').hidden = entry.verified;
  return card;
}

function screenCard(entry, front, back) {
  const item = document.createElement('li');
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
  button.addEventListener('click', () => show(back.hidden));
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
  const response = await fetch('cards.json');
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  const entries = await response.json();
  entries.sort((a, b) => a.name.localeCompare(b.name, 'pt-BR'));
  const years = entries.map(({year}) => year);
  const start = Math.min(...years);
  const end = Math.max(...years);
  const screen = document.getElementById('deck');
  const print = document.getElementById('print-deck');
  const pairs = entries.map(entry => {
    const front = frontFace(entry);
    const back = backFace(entry, start, end);
    screen.append(screenCard(entry, front.cloneNode(true), back.cloneNode(true)));
    return { front, back };
  });

  for (let i = 0; i < pairs.length; i += 9) {
    const batch = pairs.slice(i, i + 9);
    print.append(sheet(batch, 'front'), sheet(batch, 'back'));
  }

  const drafts = entries.filter(entry => !entry.verified).length;
  const note = drafts ? ` · ${drafts} com ano a confirmar` : '';
  document.getElementById('status').textContent = `${entries.length} cartas${note}`;
  const button = document.getElementById('print');
  button.disabled = false;
  button.addEventListener('click', () => window.print());
}

loadDeck().catch(() => {
  document.getElementById('status').textContent =
    'Não foi possível carregar as cartas. Abra o baralho pelo servidor local conforme o README.';
});
