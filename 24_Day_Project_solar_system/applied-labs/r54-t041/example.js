const form = document.querySelector('#conversion-form')
const input = document.querySelector('#celsius')
const error = document.querySelector('#temperature-error')
const result = document.querySelector('#result')

form.addEventListener('submit', (event) => {
  event.preventDefault()
  const rawValue = input.value.trim()

  if (rawValue === '') {
    result.textContent = ''
    error.textContent = 'Enter a temperature in Celsius.'
    input.setAttribute('aria-invalid', 'true')
    input.focus()
    return
  }

  const celsius = Number(rawValue)
  if (!Number.isFinite(celsius)) {
    result.textContent = ''
    error.textContent = 'Enter a valid finite temperature.'
    input.setAttribute('aria-invalid', 'true')
    input.focus()
    return
  }

  const fahrenheit = (celsius * 9) / 5 + 32
  error.textContent = ''
  input.removeAttribute('aria-invalid')
  result.textContent = `${celsius}°C = ${fahrenheit}°F`
})
