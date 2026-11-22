export function createList(container) {
  const nodes = new Map();
  return {
    add({ id, text }) {
      let node = nodes.get(id);
      if (!node) {
        node = document.createElement('li');
        node.dataset.id = id;
        nodes.set(id, node);
        container.append(node);
      }
      node.textContent = text;
    },
    remove(id) {
      const node = nodes.get(id);
      if (node) {
        node.remove();
        nodes.delete(id);
      }
    }
  };
}
