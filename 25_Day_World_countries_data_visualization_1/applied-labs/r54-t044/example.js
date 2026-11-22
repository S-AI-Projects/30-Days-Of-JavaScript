import { countryFixture, filterCountries } from './logic.mjs'

const query = document.querySelector('#query')
const count = document.querySelector('#count')
const list = document.querySelector('#countries')

function render() {
  const matches = filterCountries(countryFixture, query.value)
  count.textContent = `${matches.length} countr${matches.length === 1 ? 'y' : 'ies'} found`
  list.replaceChildren(...matches.map((name) => {
    const item = document.createElement('li')
    item.textContent = name
    return item
  }))
}

query.addEventListener('input', render)
render()
