export function replaceById(items, id, replacement) {
  return items.map(item => (item.id === id ? replacement : item));
}
