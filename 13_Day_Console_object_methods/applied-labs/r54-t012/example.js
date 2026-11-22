export function sumItems(items, logger) {
  if (!Array.isArray(items)) {
    throw new TypeError('items must be an array');
  }
  const total = items.reduce((sum, item) => sum + item, 0);
  if (logger) {
    logger.debug({ event: 'sumItems', count: items.length, total });
  }
  return total;
}
