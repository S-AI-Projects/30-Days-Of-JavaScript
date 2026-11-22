const form = document.querySelector('#load-form')
const input = document.querySelector('#lesson')
const inputError = document.querySelector('#input-error')
const stateText = document.querySelector('#state')
const message = document.querySelector('#message')
const dataList = document.querySelector('#data')
const retryButton = document.querySelector('#retry')
const attempts = new Map()
let requestedName = ''
let requestNumber = 0

// Injected local fixture: replace this function to connect a real loader.
async function loadLesson(name) {
  await new Promise((resolve) => setTimeout(resolve, 100))
  const attempt = (attempts.get(name) ?? 0) + 1
  attempts.set(name, attempt)
  if (name.toLowerCase() === 'retry' && attempt === 1) throw new Error('The first local attempt failed.')
  if (name.toLowerCase() === 'reject') throw new Error('The local fixture rejected this request.')
  return name.toLowerCase() === 'empty' ? [] : [`${name}: loaded from the local fixture`]
}

function showState(state, detail = '') {
  stateText.textContent = state
  stateText.dataset.state = state
  message.textContent = detail
}

async function requestLesson(name) {
  const currentRequest = ++requestNumber
  dataList.replaceChildren()
  retryButton.hidden = true
  inputError.textContent = ''
  input.removeAttribute('aria-invalid')
  showState('pending', `Loading “${name}”…`)
  try {
    const items = await loadLesson(name)
    if (currentRequest !== requestNumber) return
    for (const item of items) {
      const row = document.createElement('li')
      row.textContent = item
      dataList.append(row)
    }
    showState('ready', items.length ? 'Lesson data loaded.' : 'The lesson has no items.')
  } catch (error) {
    if (currentRequest !== requestNumber) return
    showState('error', error.message)
    retryButton.hidden = false
  }
}

form.addEventListener('submit', (event) => {
  event.preventDefault()
  const name = input.value.trim()
  if (name === '') {
    ++requestNumber
    showState('idle', 'Enter a lesson name before starting a request.')
    inputError.textContent = 'Lesson name cannot be blank.'
    input.setAttribute('aria-invalid', 'true')
    input.focus()
    return
  }
  requestedName = name
  void requestLesson(name)
})

retryButton.addEventListener('click', () => void requestLesson(requestedName))
