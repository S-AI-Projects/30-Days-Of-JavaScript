export function createFormatter(locale) {
  let formatter = new Intl.NumberFormat(locale);
  return {
    format(value) {
      return formatter.format(value);
    },
    setLocale(next) {
      formatter = new Intl.NumberFormat(next);
    }
  };
}
