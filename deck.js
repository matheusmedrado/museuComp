const svgNS = 'http://www.w3.org/2000/svg';
const levels = { 'Fácil': 1, 'Média': 2, 'Difícil': 3 };
const dither = {
  palette: ['#02474f', '#6fa1a7', '#dbfaff'],
  size: [444, 354],
  pixelSize: 1.6,
  strength: 1,
  levels: { shadows: .02, highlights: .98, minimumRange: 64, gamma: .9 },
  bayer: [[0, 8, 2, 10], [12, 4, 14, 6], [3, 11, 1, 9], [15, 7, 13, 5]],
};
const glyphs = {
  'alan-turing': 'M25 39h110v25H25z M47 39v25m22-25v25m22-25v25m22-25v25 M73 28h14l-7 8z M95 49h14m-59 0h14m33 6h10',
  'john-von-neumann': 'M61 24h38v16H61z M80 40v11m-35 0h70m-70 0v9m35-9v9m35-9v9 M31 60h28v18H31z M66 60h28v18H66z M101 60h28v18h-28z',
  'charles-babbage': 'M54 24h52v53H54z M61 29v40m9-40v40m10-40v40m10-40v40m9-40v40 M49 36h62m-62 14h62m-62 14h62',
  'margaret-hamilton': 'M61 36a11 11 0 1 0 .01 0 M42 78V68c0-8 8-12 19-12s19 4 19 12v10z M90 30h28v10H90z M94 40h32v12H94z M89 52h32v13H89z M94 65h33v13H94z',
  'grace-hopper': 'M41 28h32v44H41z M49 38h16m-16 8h16m-16 8h16 M80 49h19m-7-7 7 7-7 7 M106 31h19v38h-19z M111 40h9m-9 9h9m-9 9h9',
  'tim-berners-lee': 'M80 24a26 26 0 1 0 .01 0 M54 50h52m-26-26c-17 12-17 40 0 52m0-52c17 12 17 40 0 52 M34 42h13m67 16h13',
  'dorothy-vaughan': 'M43 27h74v48H43z M43 37h74 M65 47l-8 8 8 8m30-16 8 8-8 8m-9-19-12 22',
  'steve-jobs': 'M39 37h82v32H39z M48 45h47v16H48z M103 45h9m-9 8h9m-9 8h9 M55 69v8m50-8v8 M55 52h33',
  'bill-gates': 'M51 26h58v44H51z M51 36h58 M61 48l-5 6 5 6m13-12 5 6-5 6m14 0h12 M40 76h80',
  'ada-lovelace': 'M42 20h55l21 20v38H42z M97 20v22h21 M53 35h28m-28 12h35m-35 12h19m8 0h27m-54 10h54',
  'an-wang': 'M42 31h76v42H42z M60 38v28m20-28v28m20-28v28 M50 43h60m-60 18h60 M60 43a5 5 0 1 0 .01 0 M80 61a5 5 0 1 0 .01 0 M100 43a5 5 0 1 0 .01 0',
  'hedy-lamarr': 'M34 52h12l7-17 9 34 8-25 7 8h10m6-9 7-16 8 35 7-18h11 M45 77h70',
  'claude-shannon': 'M38 55h18V39h16v16h16V39h16v16h18 M38 66h84 M52 27a4 4 0 1 0 .01 0 M78 22v8m21-3a4 4 0 1 0 .01 0',
  hollerith: 'M31 35h98v35H31z M42 44h4m8 0h4m8 0h4m8 0h4m8 0h4m8 0h4m8 0h4 M42 53h4m20 0h4m20 0h4m20 0h4 M54 62h4m20 0h4m20 0h4',
  eniac: 'M28 23h104v52H28z M62 23v52m36-52v52 M37 34h16m-16 12h16m-16 12h16m18-24h18m-18 12h18m-18 12h18m18-24h16m-16 12h16m-16 12h16',
  transistor: 'M80 36a19 19 0 1 0 .01 0 M61 55H38m28-10 49-23m-49 43 49 14m-22-13 10 9-14 1 M65 44v23',
  'circuito-integrado': 'M58 29h44v44H58z M67 38h26v26H67z M46 37h12m-12 10h12m-12 10h12m-12 10h12m44-30h12m-12 10h12m-12 10h12m-12 10h12 M68 18v11m12-11v11m12-11v11m-24 44v11m12-11v11m12-11v11',
  mouse: 'M81 29c-5-17 26-7 24-18 M57 53c0-13 9-24 23-24s23 11 23 24v10c0 12-9 18-23 18s-23-6-23-18z M57 50h46M80 29v21',
  'ibm-system-360': 'M33 29h94v47H33z M65 29v47m30-47v47 M40 41h18v17H40z M48 44a4 4 0 1 0 .01 0 M72 41h16m-16 9h16m-16 9h16m14-18h18m-18 9h18m-18 9h18',
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

function luminanceLevels(pixels, { shadows, highlights, minimumRange }) {
  const luminance = new Uint8Array(pixels.length / 4);
  const histogram = new Uint32Array(256);
  for (let i = 0; i < luminance.length; i++) {
    const p = i * 4;
    luminance[i] = Math.round(.2126 * pixels[p] + .7152 * pixels[p + 1] + .0722 * pixels[p + 2]);
    histogram[luminance[i]]++;
  }
  function percentile(fraction) {
    const rank = Math.floor((luminance.length - 1) * fraction);
    let count = 0;
    for (let tone = 0; tone < histogram.length; tone++) {
      count += histogram[tone];
      if (count > rank) return tone;
    }
    return 255;
  }
  const low = percentile(shadows);
  const high = percentile(highlights);
  return high - low >= minimumRange ? { luminance, low, high } : { luminance, low: 0, high: 255 };
}

async function ditheredArtwork(path) {
  const image = new Image();
  image.src = path;
  await image.decode();

  const { palette, size, pixelSize, strength, levels, bayer } = dither;
  const canvas = document.createElement('canvas');
  const [width, height] = size.map(dimension => Math.max(1, Math.round(dimension / pixelSize)));
  canvas.width = width;
  canvas.height = height;
  canvas.setAttribute('aria-hidden', 'true');
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  ctx.fillStyle = '#fff';
  ctx.fillRect(0, 0, width, height);
  const scale = Math.max(width / image.naturalWidth, height / image.naturalHeight);
  const imageWidth = image.naturalWidth * scale;
  const imageHeight = image.naturalHeight * scale;
  const yAlign = image.naturalHeight > image.naturalWidth ? .2 : .5;
  ctx.drawImage(image, (width - imageWidth) / 2, (height - imageHeight) * yAlign, imageWidth, imageHeight);

  const pixels = ctx.getImageData(0, 0, width, height);
  const { luminance, low, high } = luminanceLevels(pixels.data, levels);
  const colors = palette.map(hex => hex.slice(1).match(/../g).map(channel => parseInt(channel, 16)));
  const order = bayer.length;
  const last = colors.length - 1;
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const i = y * width + x;
      const normalized = Math.min(1, Math.max(0, (luminance[i] - low) / (high - low)));
      const offset = strength * (.5 - (bayer[y % order][x % order] + .5) / (order ** 2));
      const tone = Math.round(normalized ** levels.gamma * last + offset);
      pixels.data.set(colors[tone], i * 4);
    }
  }
  ctx.putImageData(pixels, 0, 0);
  return canvas;
}

function licenseName(credit) {
  return credit.license === 'Public domain' ? 'Domínio público' : credit.license;
}

async function applyImage(entry, credit, fronts) {
  if (!entry.image || !credit) return;
  try {
    const canvas = await ditheredArtwork(entry.image);
    for (const [i, front] of fronts.entries()) {
      const art = i === 0 ? canvas : canvas.cloneNode();
      if (i !== 0) art.getContext('2d').drawImage(canvas, 0, 0);
      front.querySelector('.art svg').replaceWith(art);
      const label = front.querySelector('.image-credit');
      label.textContent = `${credit.author} · ${licenseName(credit)}`;
      label.hidden = false;
    }
  } catch {
    // Keep the SVG if the image cannot be loaded or processed.
  }
}

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
    item.querySelector('.credit-license').href = credit.license_url;
    item.querySelector('.credit-source').href = credit.source_url;
    if (credit.note) {
      setText(item, '.credit-note', credit.note);
      item.querySelector('.credit-note').hidden = false;
    }
    list.append(item);
  }
}

async function fetchJSON(path) {
  const response = await fetch(path);
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  return response.json();
}

function face(side) {
  return document.getElementById(side).content.firstElementChild.cloneNode(true);
}

function setText(card, selector, value) {
  card.querySelector(selector).textContent = value;
}

function frontFace(entry, template = 'front') {
  const card = face(template);
  setText(card, '.name', entry.name);
  setText(card, '.clue', entry.clue);
  setText(card, '.category', entry.category);
  card.querySelector('.art').append(artwork(entry.id));
  const level = levels[entry.difficulty];
  card.querySelector('.difficulty').hidden = !level;
  if (level) {
    setText(card, '.level', entry.difficulty);
    const pips = card.querySelector('.pips');
    for (let i = 0; i < 3; i++) {
      const pip = document.createElement('i');
      if (i < level) pip.className = 'on';
      pips.append(pip);
    }
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

function labsCard(entry, start, end) {
  const preview = document.getElementById('labs-preview');
  const front = frontFace(entry, 'labs-front');
  const back = face('labs-back');
  setText(back, '.year', entry.year);
  back.querySelector('.draft').hidden = entry.verified;
  const originalFront = frontFace(entry);
  const originalBack = backFace(entry, start, end);
  preview.replaceChildren();
  for (const [label, proposal, original] of [
    ['Frente · a pergunta', front, originalFront],
    ['Verso · a resposta', back, originalBack],
  ]) {
    const figure = document.createElement('figure');
    const caption = document.createElement('figcaption');
    caption.textContent = label;
    original.hidden = true;
    figure.append(caption, proposal, original);
    preview.append(figure);
  }
  const compare = document.getElementById('labs-compare');
  compare.disabled = false;
  compare.addEventListener('click', () => {
    const showOriginal = compare.getAttribute('aria-pressed') !== 'true';
    front.hidden = back.hidden = showOriginal;
    originalFront.hidden = originalBack.hidden = !showOriginal;
    compare.setAttribute('aria-pressed', String(showOriginal));
  });
  preview.setAttribute('aria-busy', 'false');
  return [front, originalFront];
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
  const [entries, credits] = await Promise.all([
    fetchJSON('cards.json'),
    fetchJSON('img/cards/credits.json').catch(() => null),
  ]);
  entries.sort((a, b) => a.name.localeCompare(b.name, 'pt-BR'));
  const years = entries.map(({year}) => year);
  const start = Math.min(...years);
  const end = Math.max(...years);
  const screen = document.getElementById('deck');
  const print = document.getElementById('print-deck');
  const images = [];
  // Keep the experiment to one catalog entry; never add it to the print sheets.
  const sample = entries.find(entry => entry.id === 'alan-turing') || entries[0];
  if (sample) {
    const fronts = labsCard(sample, start, end);
    images.push(applyImage(sample, credits?.[sample.id], fronts));
  }
  const pairs = entries.map(entry => {
    const front = frontFace(entry);
    const back = backFace(entry, start, end);
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
  if (credits) {
    showCredits(entries, credits);
  } else {
    const status = document.getElementById('credits-status');
    status.textContent = 'Não foi possível carregar os créditos. As cartas mostram as ilustrações de reserva.';
    status.hidden = false;
  }
  await Promise.all(images);
  const button = document.getElementById('print');
  button.disabled = false;
  button.addEventListener('click', () => window.print());
}

loadDeck().catch(() => {
  document.getElementById('status').textContent =
    'Não foi possível carregar as cartas. Abra o baralho pelo servidor local conforme o README.';
  const status = document.getElementById('labs-status');
  if (status) status.textContent = 'Não foi possível carregar o experimento. Tente atualizar a página.';
  document.getElementById('labs-preview').setAttribute('aria-busy', 'false');
});
