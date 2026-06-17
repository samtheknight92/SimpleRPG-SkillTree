import { state } from './state.js'

export function isGmMode() {
  return Boolean(state.gmMode)
}

export function setGmMode(enabled) {
  state.gmMode = Boolean(enabled)
}

export function toggleGmMode() {
  setGmMode(!state.gmMode)
  return state.gmMode
}
