// A brief introduction, never a loading gate. No network request can hold the desktop.
const screen = document.getElementById('boot-screen');
const shell = document.getElementById('os-shell');
const skip = document.getElementById('skip-boot');
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
const storageKey = 'compline-boot-seen';
let seen = false;
try { seen = sessionStorage.getItem(storageKey) === 'true'; } catch { /* Storage is optional. */ }

if (!seen && !location.hash && !reducedMotion.matches) {
  const previousFocus = document.activeElement;
  screen.hidden = false;
  shell.inert = true;
  document.documentElement.classList.add('is-booting');
  skip.focus({ preventScroll: true });

  const statusTimer = setTimeout(() => {
    document.getElementById('boot-status').textContent = 'Sua próxima descoberta está pronta.';
  }, 1000);
  const finishTimer = setTimeout(finish, 1800);

  function finish() {
    if (screen.hidden) return;
    clearTimeout(statusTimer);
    clearTimeout(finishTimer);
    screen.hidden = true;
    shell.inert = false;
    document.documentElement.classList.remove('is-booting');
    try { sessionStorage.setItem(storageKey, 'true'); } catch { /* Private browsing still works. */ }
    screen.removeEventListener('keydown', trapKeys);
    reducedMotion.removeEventListener('change', finish);
    removeEventListener('hashchange', finish);
    // Only move focus if the introduction owned it, not after browser navigation.
    if (document.activeElement === document.body || document.activeElement === skip) {
      const target = previousFocus !== document.body ? previousFocus : document.querySelector('.os-window:not([hidden])');
      target?.focus({ preventScroll: true });
    }
  }

  function trapKeys(event) {
    if (event.key === 'Escape') {
      event.preventDefault();
      event.stopPropagation();
      finish();
    } else if (event.key === 'Tab') {
      // The only interactive element in this short modal is the skip control.
      event.preventDefault();
      skip.focus();
    }
  }
  screen.addEventListener('keydown', trapKeys);
  skip.addEventListener('click', finish, { once: true });
  reducedMotion.addEventListener('change', finish, { once: true });
  addEventListener('hashchange', finish, { once: true });
  addEventListener('pageshow', event => { if (event.persisted) finish(); });
}
