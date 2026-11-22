export const countryFixture = ['India', 'Iceland', 'Japan']

export function filterCountries(countries, query) {
  const normalized = query.trim().toLocaleLowerCase()
  return countries.filter((country) => country.toLocaleLowerCase().includes(normalized))
}
