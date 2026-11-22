const frequencies = [
  { category: 'A', count: 3 },
  { category: 'B', count: 1 },
  { category: 'C', count: 2 },
]
const chart = document.querySelector('#chart')
const tableBody = document.querySelector('#values')
const stats = document.querySelector('#stats')
let renderCount = 0
let rowsCreated = 0

function renderChart() {
  renderCount += 1
  chart.replaceChildren()
  tableBody.replaceChildren()
  const max = Math.max(...frequencies.map(({ count }) => count), 1)

  for (const { category, count } of frequencies) {
    const row = document.createElement('div')
    row.className = 'bar-row'
    row.dataset.category = category
    const label = document.createElement('span')
    label.textContent = category
    const bar = document.createElement('span')
    bar.className = 'bar'
    bar.dataset.count = String(count)
    bar.style.setProperty('--bar-width', `${(count / max) * 100}%`)
    bar.textContent = String(count)
    row.append(label, bar)
    chart.append(row)

    const tableRow = document.createElement('tr')
    const categoryCell = document.createElement('th')
    categoryCell.scope = 'row'
    categoryCell.textContent = category
    const countCell = document.createElement('td')
    countCell.textContent = String(count)
    tableRow.append(categoryCell, countCell)
    tableBody.append(tableRow)
  }

  rowsCreated += frequencies.length * 2
  stats.textContent = `Renders: ${renderCount}; chart and table rows created: ${rowsCreated}.`
}

document.querySelector('#render-again').addEventListener('click', renderChart)
renderChart()
