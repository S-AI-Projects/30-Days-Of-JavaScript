import { characters, selectCharacters } from './logic.mjs'

const queryInput = document.querySelector('#query')
const sortButton = document.querySelector('#sort')
const state = document.querySelector('#state')
const results = document.querySelector('#results')
let sortByScore = false

function render() {
  const selected = characters.filter((item) => item.name.toLocaleLowerCase().includes(queryInput.value.trim().toLocaleLowerCase()))
  const displayed = selectCharacters(characters, queryInput.value, sortByScore)
  results.replaceChildren(...displayed.map((record) => {
    const row = document.createElement('li')
    row.dataset.id = record.id
    row.textContent = `${record.name} — ${record.score}`
    return row
  }))
  state.textContent = `${selected.length} match${selected.length === 1 ? '' : 'es'}; ${sortByScore ? 'sorted by numeric score' : 'in source order'}.`
}

queryInput.addEventListener('input', render)
sortButton.addEventListener('click', () => {
  sortByScore = !sortByScore
  sortButton.setAttribute('aria-pressed', String(sortByScore))
  render()
})

render()
