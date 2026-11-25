// The same documents remain independently usable and printable.
if (parent !== window && new URLSearchParams(location.search).has('desktop')) {
  document.documentElement.classList.add('in-desktop');
  if (new URLSearchParams(location.search).get('view') === 'credits') {
    document.documentElement.classList.add('credits-app');
  }
}
