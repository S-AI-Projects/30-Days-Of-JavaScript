export const characters = [
  { name: 'Ant', speed: 10 },
  { name: 'Anaconda', speed: 2 },
  { name: 'Bee', speed: 5 },
  { name: 'Panther', speed: 30 }
];

export function searchAndSort(items, query) {
  const term = query.trim().toLowerCase();
  return items
    .filter(item => item.name.toLowerCase().includes(term))
    .sort((a, b) => a.speed - b.speed);
}

export function mount(input, list, message) {
  function update() {
    const found = searchAndSort(characters, input.value);
    list.replaceChildren(
      ...found.map(item => {
        const li = document.createElement('li');
        li.textContent = `${item.name} ${item.speed}`;
        return li;
      })
    );
    message.textContent = found.length === 0 ? 'No characters found' : '';
  }
  input.addEventListener('input', update);
  update();
}
