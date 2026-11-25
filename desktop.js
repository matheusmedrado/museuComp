// Progressive enhancement: standalone documents keep the same data and print pipeline.
const desktop = document.querySelector('.desktop');
const windows = [...desktop.querySelectorAll('.os-window')];
const byId = new Map(windows.map(window => [window.id, window]));
const announcement = document.getElementById('desktop-announcement');
const wideScreen = matchMedia('(min-width: 901px)');
const legacySections = { '1': 'inicio', '2': 'como-jogar', '3': 'como-jogar', '4': 'manual/bits-title', '5': 'baralho', '6': 'imprimir', '7': 'imprimir', conteudo: 'inicio' };
const lastLauncher = new Map();
let layer = 10;
let activeWindow;

function focusWindow(window) {
  activeWindow = window;
  window.style.zIndex = ++layer;
  for (const link of document.querySelectorAll('.os-menubar [data-open]')) {
    link.dataset.active = String(link.dataset.open === window.id && !window.hidden);
  }
}

function placeWindow(window) {
  if (!wideScreen.matches) return;
  window.style.left = Math.max(16, (desktop.clientWidth - window.offsetWidth) / 2) + 'px';
  window.style.top = Math.max(16, (desktop.clientHeight - window.offsetHeight) / 2) + 'px';
}

function loadFrame(window, section = '') {
  const frame = window.querySelector('iframe');
  if (!frame) return;
  if (section) frame.dataset.section = section;
  if (!frame.getAttribute('src')) frame.src = frame.dataset.src;
  else if (section && frame.dataset.loaded === 'true') scrollFrame(frame, section);
}

function scrollFrame(frame, section) {
  // Sections are element ids, never destinations or executable URLs.
  const target = frame.contentDocument?.getElementById(section);
  if (target) {
    target.scrollIntoView({ block: 'start' });
    target.setAttribute('tabindex', '-1');
    target.focus({ preventScroll: true });
  }
}

function openWindow(id, moveFocus = true, section = '') {
  const window = byId.get(id);
  if (!window) return;
  if (!wideScreen.matches) {
    for (const item of windows) if (item !== window) item.hidden = true;
  }
  const wasHidden = window.hidden;
  window.hidden = false;
  loadFrame(window, section);
  if (id === 'imprimir') {
    loadFrame(byId.get('baralho'));
    loadFrame(byId.get('manual'));
  }
  if (wasHidden && (!window.style.left || !window.style.top)) placeWindow(window);
  focusWindow(window);
  if (moveFocus) window.focus({ preventScroll: true });
}

function readHash(moveFocus = false) {
  const hash = location.hash.slice(1);
  const route = Object.hasOwn(legacySections, hash) ? legacySections[hash] : hash;
  const [id = 'inicio', section = ''] = (route || 'inicio').split('/');
  // Only our fixed application ids may open; a fragment can never leave the OS.
  if (byId.has(id)) openWindow(id, moveFocus, section);
  else openWindow('inicio', moveFocus);
}

function setHash(id, section = '') {
  const hash = id === 'inicio' ? '' : '#' + id + (section ? '/' + encodeURIComponent(section) : '');
  history.replaceState(null, '', location.pathname + location.search + hash);
}

function hideWindow(window, action) {
  window.hidden = true;
  const next = windows.filter(item => !item.hidden).sort((a, b) => Number(b.style.zIndex) - Number(a.style.zIndex))[0];
  if (next) focusWindow(next);
  else {
    activeWindow = undefined;
    document.querySelectorAll('.os-menubar [data-open]').forEach(link => link.dataset.active = 'false');
  }
  setHash(next?.id || 'inicio');
  const launcher = lastLauncher.get(window.id);
  const fallback = document.querySelector('.os-menubar [data-open="' + window.id + '"]')
    || document.querySelector('.desktop-shortcuts [data-open="' + window.id + '"]')
    || document.querySelector('.os-menubar [data-open="inicio"]');
  (launcher && !launcher.closest('[hidden]') ? launcher : fallback)?.focus({ preventScroll: true });
  announcement.textContent = window.querySelector('.window-file').textContent + ': janela ' + (action === 'minimize' ? 'minimizada' : 'fechada') + '. Reabra pelo menu ou pelos atalhos.';
}

function escapeWindow(event) {
  if (event.key === 'Escape' && activeWindow && !activeWindow.hidden) {
    event.preventDefault();
    hideWindow(activeWindow, 'close');
  }
}

function documentRoute(url) {
  if (url.origin !== location.origin) return null;
  const file = url.pathname.split('/').pop();
  if (file === 'deck.html') {
    if (url.hash === '#creditos') return ['creditos', ''];
    if (url.hash === '#imprimir') return ['imprimir', ''];
    return ['baralho', url.hash.slice(1)];
  }
  if (file === 'manual.html') return ['manual', url.hash.slice(1)];
  if (file === 'index.html' || file === '') {
    const raw = url.hash.slice(1) || 'inicio';
    const route = Object.hasOwn(legacySections, raw) ? legacySections[raw] : raw;
    const [id, section = ''] = route.split('/');
    if (byId.has(id)) return [id, section];
  }
  return null;
}

function syncPrintControls(id, frame) {
  const button = frame.contentDocument?.getElementById(id === 'manual' ? 'print-manual' : 'print');
  const ready = button && !button.disabled && !button.hidden;
  for (const control of document.querySelectorAll('[data-print="' + id + '"]')) control.disabled = !ready;
  for (const status of document.querySelectorAll('[data-print-status="' + id + '"]')) {
    status.textContent = ready ? (id === 'manual' ? 'A4 · duas páginas' : 'A4 · frente e verso · coleção completa')
      : (frame.contentDocument?.getElementById('load-error')?.hidden === false ? 'Não foi possível carregar. Abra o baralho para tentar novamente.' : 'Preparando o arquivo…');
  }
}

document.documentElement.classList.add('desktop-ready');
for (const window of windows) {
  window.hidden = true;
  window.querySelector('.window-controls').hidden = false;
  window.addEventListener('pointerdown', () => focusWindow(window));
  window.addEventListener('focusin', () => focusWindow(window));
  window.querySelector('.window-controls').addEventListener('click', event => {
    const button = event.target.closest('button');
    if (!button) return;
    const action = button.dataset.windowAction;
    if (action === 'maximize') {
      const maximized = window.classList.toggle('is-maximized');
      button.setAttribute('aria-pressed', String(maximized));
      button.title = maximized ? 'Restaurar' : 'Expandir';
      button.setAttribute('aria-label', (maximized ? 'Restaurar ' : 'Expandir ') + window.querySelector('.window-file').textContent);
      announcement.textContent = maximized ? 'Janela expandida.' : 'Tamanho da janela restaurado.';
    } else hideWindow(window, action);
  });

  const titlebar = window.querySelector('.window-titlebar');
  titlebar.addEventListener('pointerdown', event => {
    if (!wideScreen.matches || event.button !== 0 || event.target.closest('button') || window.classList.contains('is-maximized')) return;
    const bounds = desktop.getBoundingClientRect();
    const rect = window.getBoundingClientRect();
    const offsetX = event.clientX - rect.left;
    const offsetY = event.clientY - rect.top;
    titlebar.setPointerCapture(event.pointerId);
    window.classList.add('is-dragging');
    function move(event) {
      const maxLeft = Math.max(0, desktop.clientWidth - window.offsetWidth - 8);
      const maxTop = Math.max(0, desktop.clientHeight - window.offsetHeight - 8);
      window.style.left = Math.max(8, Math.min(maxLeft, event.clientX - bounds.left - offsetX)) + 'px';
      window.style.top = Math.max(8, Math.min(maxTop, event.clientY - bounds.top - offsetY)) + 'px';
    }
    function end() {
      window.classList.remove('is-dragging');
      titlebar.removeEventListener('pointermove', move);
      titlebar.removeEventListener('pointerup', end);
      titlebar.removeEventListener('pointercancel', end);
    }
    titlebar.addEventListener('pointermove', move);
    titlebar.addEventListener('pointerup', end);
    titlebar.addEventListener('pointercancel', end);
    event.preventDefault();
  });

  const frame = window.querySelector('iframe');
  if (frame) frame.addEventListener('load', () => {
    if (!frame.getAttribute('src')) return;
    const doc = frame.contentDocument;
    if (!doc) return;
    frame.dataset.loaded = 'true';
    doc.addEventListener('pointerdown', () => focusWindow(window));
    doc.addEventListener('focusin', () => focusWindow(window));
    doc.addEventListener('keydown', escapeWindow);
    doc.addEventListener('click', event => {
      const link = event.target.closest('a[href]');
      if (!link || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
      const url = new URL(link.href);
      // Same-document sections stay inside their own scrollable app.
      if (url.pathname === new URL(frame.src).pathname && !link.getAttribute('href').includes('.html')) return;
      const route = documentRoute(url);
      if (route) {
        event.preventDefault();
        lastLauncher.set(route[0], document.querySelector('.os-menubar [data-open="' + route[0] + '"]'));
        openWindow(route[0], true, route[1]);
        setHash(...route);
      } else if (url.origin !== location.origin) {
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
      }
    });
    if (window.id === 'baralho' || window.id === 'manual') {
      syncPrintControls(window.id, frame);
      new MutationObserver(() => syncPrintControls(window.id, frame)).observe(doc.body, { subtree: true, attributes: true, attributeFilter: ['disabled', 'hidden'] });
    }
    if (frame.dataset.section) scrollFrame(frame, frame.dataset.section);
  });
}

document.addEventListener('click', event => {
  const print = event.target.closest('[data-print]');
  if (print && !print.disabled) {
    const id = print.dataset.print;
    byId.get(id).querySelector('iframe').contentDocument.getElementById(id === 'manual' ? 'print-manual' : 'print').click();
    return;
  }
  const launcher = event.target.closest('[data-open]');
  if (!launcher || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
  event.preventDefault();
  lastLauncher.set(launcher.dataset.open, launcher);
  const section = launcher.dataset.section || '';
  openWindow(launcher.dataset.open, true, section);
  setHash(launcher.dataset.open, section);
});
document.addEventListener('keydown', escapeWindow);
addEventListener('hashchange', () => readHash(true));
addEventListener('resize', () => {
  for (const window of windows) {
    window.style.left = '';
    window.style.top = '';
    if (!window.hidden) placeWindow(window);
  }
  if (!wideScreen.matches && activeWindow) {
    for (const window of windows) if (window !== activeWindow) window.hidden = true;
  }
});
readHash(Boolean(location.hash));

const clock = document.getElementById('os-clock');
function updateClock() {
  const now = new Date();
  clock.dateTime = now.toISOString();
  clock.textContent = now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  clock.setAttribute('aria-label', 'Hora atual: ' + clock.textContent);
}
updateClock();
setInterval(updateClock, 60000);
