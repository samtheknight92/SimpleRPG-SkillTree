import { esc } from './utils.js'

/** Adjust a number input by ±step, respecting min/max. */
export function stepNumberInput(input, delta = 1) {
  if (!input || input.type !== 'number') return
  const step = Number(input.step || 1) || 1
  const min = input.min !== '' ? Number(input.min) : null
  const max = input.max !== '' ? Number(input.max) : null
  const raw = String(input.value ?? '').trim()
  let current = raw === '' ? 0 : Number(raw)
  if (!Number.isFinite(current)) current = 0
  let next = current + Number(delta || 0) * step
  if (min != null && Number.isFinite(min)) next = Math.max(min, next)
  if (max != null && Number.isFinite(max)) next = Math.min(max, next)
  input.value = String(next)
  input.dispatchEvent(new Event('input', { bubbles: true }))
  input.dispatchEvent(new Event('change', { bubbles: true }))
}

/**
 * Number input with − / + buttons (touch-friendly on mobile).
 * @param {object} options
 */
export function renderNumberStepper(options = {}) {
  const {
    id,
    name,
    value = '',
    min,
    max,
    step,
    placeholder = '',
    className = 'input',
    inputMode = 'numeric',
    required = false,
    tiny = false,
    decreaseLabel = 'Decrease',
    increaseLabel = 'Increase'
  } = options

  const minAttr = min != null && min !== '' ? ` min="${esc(String(min))}"` : ''
  const maxAttr = max != null && max !== '' ? ` max="${esc(String(max))}"` : ''
  const stepAttr = step != null && step !== '' && Number(step) !== 1 ? ` step="${esc(String(step))}"` : ''
  const idAttr = id ? ` id="${esc(id)}"` : ''
  const nameAttr = name ? ` name="${esc(name)}"` : ''
  const valueAttr = value === '' || value == null ? '' : ` value="${esc(String(value))}"`
  const reqAttr = required ? ' required' : ''
  const inputClass = tiny ? `${className} tiny` : className

  return `
    <div class="number-stepper${tiny ? ' number-stepper-tiny' : ''}">
      <button type="button" class="number-stepper-btn" data-number-stepper-delta="-1" aria-label="${esc(decreaseLabel)}">−</button>
      <input class="${inputClass}" type="number"${idAttr}${nameAttr}${valueAttr}${minAttr}${maxAttr}${stepAttr} inputmode="${inputMode}" placeholder="${esc(placeholder)}"${reqAttr} />
      <button type="button" class="number-stepper-btn" data-number-stepper-delta="1" aria-label="${esc(increaseLabel)}">+</button>
    </div>
  `
}
