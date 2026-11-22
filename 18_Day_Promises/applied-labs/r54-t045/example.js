const form = document.querySelector('#load-form')
const input = document.querySelector('#topic')
const inputError = document.querySelector('#input-error')
const state = document.querySelector('#state')
const message = document.querySelector('#message')
const result = document.querySelector('#result')
let requestId = 0

// Injected deterministic loader. The special value `fail` exercises the error path locally.
async function loadTopic(topic) {
  await new Promise((resolve) => setTimeout(resolve, 80))
  if (topic.toLowerCase() === 'fail') throw new Error('The local lesson fixture failed to load.')
  return [`${topic}: lesson data loaded locally`]
}

form.addEventListener('submit', async (event) => {
  event.preventDefault()
  const topic = input.value.trim()
  if (!topic) {
    ++requestId
    state.textContent = 'idle'
    message.textContent = ''
    result.replaceChildren()
    inputError.textContent = 'Enter a topic to load.'
    input.setAttribute('aria-invalid', 'true')
    input.focus()
    return
  }

  const currentRequest = ++requestId
  inputError.textContent = ''
  input.removeAttribute('aria-invalid')
  result.replaceChildren()
  state.textContent = 'pending'
  message.textContent = `Loading “${topic}”…`
  try {
    const items = await loadTopic(topic)
    if (currentRequest !== requestId) return
    for (const item of items) {
      const row = document.createElement('li')
      row.textContent = item
      result.append(row)
    }
    state.textContent = 'ready'
    message.textContent = 'Loaded successfully.'
  } catch (error) {
    if (currentRequest !== requestId) return
    state.textContent = 'error'
    message.textContent = error.message
  }
})
