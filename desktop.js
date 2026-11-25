// Ordinary anchors and sections remain useful without this enhancement.
const desktop = document.querySelector('.desktop');
const windows = [...desktop.querySelectorAll('.os-window')];
const byId = new Map(windows.map(window => [window.id, window]));
const announcement = document.getElementById('desktop-announcement');
const wideScreen = matchMedia('(min-width: 901px)');
const legacySections = { '1': 'inicio', '2': 'como-jogar', '3': 'como-jogar', '5': 'deck.html#deck-title', '6': 'imprimir', '7': 'imprimir', '4': 'manual.html#bits-title', conteudo: 'inicio' };
const lastLauncher = new Map();
let layer = 10;
let activeWindow;

function focusWindow(window) {
  activeWindow = window;
  window.style.zIndex = ++layer;
  for (const link of document.querySelectorAll('.os-dock [data-open]')) {
    link.dataset.active = String(link.dataset.open === window.id && !window.hidden);
  }
}

function openWindow(id, moveFocus = true) {
  const window = byId.get(id);
  if (!window) return;
  window.hidden = false;
  focusWindow(window);
  if (moveFocus) {
    window.focus({ preventScroll: wideScreen.matches });
    if (!wideScreen.matches) window.scrollIntoView({ block: 'start' });
  }
}

function readHash(moveFocus = false) {
  const hash = location.hash.slice(1);
  const legacy = Object.hasOwn(legacySections, hash) ? legacySections[hash] : undefined;
  const id = legacy || hash || 'inicio';
  // Only our fixed legacy destinations may navigate away from this document.
  if (legacy && legacy.includes('.html')) return location.replace(legacy);
  if (byId.has(id)) openWindow(id, moveFocus);
}

function setHash(id) {
  const hash = id === 'inicio' ? '' : `#${id}`;
  // Avoid scrolling the fixed desktop to a fragment target.
  history.replaceState(null, '', `${location.pathname}${location.search}${hash}`);
}

function hideWindow(window, action) {
  window.hidden = true;
  const next = windows.filter(item => !item.hidden).sort((a, b) => Number(b.style.zIndex) - Number(a.style.zIndex))[0];
  if (next) focusWindow(next);
  else {
    activeWindow = undefined;
    document.querySelectorAll('.os-dock [data-open]').forEach(link => link.dataset.active = 'false');
  }
  setHash(next?.id || 'inicio');
  const launcher = lastLauncher.get(window.id);
  const fallback = document.querySelector(`.os-dock [data-open="${window.id}"]`);
  (launcher && !launcher.closest('[hidden]') ? launcher : fallback)?.focus({ preventScroll: true });
  announcement.textContent = `${window.querySelector('.window-file').textContent.trim()}: janela ${action === 'minimize' ? 'minimizada' : 'fechada'}. Reabra pelo menu ou pelos atalhos.`;
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
      button.setAttribute('aria-label', `${maximized ? 'Restaurar' : 'Expandir'} ${window.querySelector('.window-file').textContent.trim()}`);
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
      const maxLeft = Math.max(0, desktop.clientWidth - window.offsetWidth);
      const maxTop = Math.max(0, desktop.clientHeight - window.offsetHeight - 140);
      window.style.left = `${Math.max(0, Math.min(maxLeft, event.clientX - bounds.left - offsetX))}px`;
      window.style.top = `${Math.max(0, Math.min(maxTop, event.clientY - bounds.top - offsetY))}px`;
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
}

document.addEventListener('click', event => {
  const launcher = event.target.closest('[data-open]');
  if (!launcher || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
  event.preventDefault();
  lastLauncher.set(launcher.dataset.open, launcher);
  openWindow(launcher.dataset.open);
  setHash(launcher.dataset.open);
});
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && activeWindow && !activeWindow.hidden) hideWindow(activeWindow, 'close');
});
addEventListener('hashchange', () => readHash(true));
// Viewport changes reset positions so the window controls cannot get stranded.
addEventListener('resize', () => windows.forEach(window => {
  window.style.left = '';
  window.style.top = '';
}));
openWindow('inicio', false);
readHash();

const clock = document.getElementById('os-clock');
function updateClock() {
  const now = new Date();
  clock.dateTime = now.toISOString();
  clock.textContent = now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  clock.setAttribute('aria-label', `Hora atual: ${clock.textContent}`);
}
updateClock();
setInterval(updateClock, 60000);
