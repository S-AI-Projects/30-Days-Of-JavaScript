export function createCounter() {
  let count = 0;
  return {
    increment() {
      count += 1;
    },
    read() {
      return count;
    }
  };
}
