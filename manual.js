const printButton = document.getElementById('print-manual');
printButton.addEventListener('click', async () => {
  await Promise.all([document.fonts.ready, exampleReady]);
  window.print();
});
printButton.hidden = false;

async function showExample() {
  const response = await fetch('cards.json');
  if (!response.ok) return;
  const cards = await response.json();
  const before = cards.find(card => card.id === 'alan-turing');
  const guess = cards.find(card => card.id === 'transistor');
  const after = cards.find(card => card.id === 'grace-hopper');
  if (!before || !guess || !after || !(before.year <= guess.year && guess.year <= after.year)) return;

  for (const [slot, card] of [['before', before], ['guess', guess], ['after', after]]) {
    const mini = document.getElementById(`example-${slot}`);
    mini.querySelector('.name').textContent = card.name;
    const year = mini.querySelector('.year');
    if (year) year.textContent = card.year;
  }
  document.getElementById('example-picked').textContent = guess.name;
  document.getElementById('example-year').textContent = guess.year;
  document.getElementById('example').hidden = false;
}

const exampleReady = showExample().catch(() => {
  document.getElementById('example').hidden = true;
});
