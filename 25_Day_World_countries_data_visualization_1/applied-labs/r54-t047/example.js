const countries = ['India', 'Iceland', 'Japan']
const queryInput = document.querySelector('#query')
const trace = document.querySelector('#trace')
const count = document.querySelector('#count')
const list = document.querySelector('#countries')

function filterCountries(records, query) {
  const normalizedQuery = query.trim().toLocaleLowerCase()
  const examined = records.map((name) => ({
    name,
    normalizedName: name.toLocaleLowerCase(),
    matches: name.toLocaleLowerCase().includes(normalizedQuery),
  }))
  return { normalizedQuery, examined, matches: examined.filter((country) => country.matches).map((country) => country.name) }
}

function render() {
  const result = filterCountries(countries, queryInput.value)
  trace.textContent = `Input “${queryInput.value}” → normalized query “${result.normalizedQuery}”; checked ${result.examined.length} names.`
  count.textContent = `${result.matches.length} countr${result.matches.length === 1 ? 'y' : 'ies'} found`
  list.replaceChildren(...result.matches.map((name) => {
    const item = document.createElement('li')
    item.textContent = name
    return item
  }))
}

queryInput.addEventListener('input', render)
render()
