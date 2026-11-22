import { parseStoredTasks, serializeTasks, STORAGE_KEY, visibleTasks } from './logic.mjs'

const form = document.querySelector('#task-form')
const input = document.querySelector('#new-task')
const list = document.querySelector('#tasks')
const storageMessage = document.querySelector('#storage-message')
let { tasks, corrupt } = parseStoredTasks(localStorage.getItem(STORAGE_KEY))
let filter = 'all'

if (corrupt) storageMessage.textContent = 'Saved tasks were invalid, so the board was reset.'

function save() {
  localStorage.setItem(STORAGE_KEY, serializeTasks(tasks))
}

function render() {
  list.replaceChildren()
  for (const task of visibleTasks(tasks, filter)) {
    const row = document.createElement('li')
    const label = document.createElement('span')
    label.textContent = task.label
    if (task.completed) label.setAttribute('data-completed', 'true')
    const button = document.createElement('button')
    button.type = 'button'
    button.textContent = task.completed ? 'Undo' : 'Complete'
    button.setAttribute('aria-label', `${task.completed ? 'Undo' : 'Complete'}: ${task.label}`)
    button.addEventListener('click', () => {
      tasks = tasks.map((item) => item.id === task.id ? { ...item, completed: !item.completed } : item)
      save()
      render()
    })
    row.append(label, button)
    list.append(row)
  }
}

form.addEventListener('submit', (event) => {
  event.preventDefault()
  const label = input.value.trim()
  if (!label) return
  tasks = [...tasks, { id: crypto.randomUUID(), label, completed: false }]
  save()
  input.value = ''
  input.focus()
  render()
})

document.querySelectorAll('[data-filter]').forEach((button) => {
  button.addEventListener('click', () => {
    filter = button.dataset.filter
    document.querySelectorAll('[data-filter]').forEach((item) => {
      item.setAttribute('aria-pressed', String(item === button))
    })
    render()
  })
})

render()
