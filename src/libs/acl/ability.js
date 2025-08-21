import { Ability } from '@casl/ability'
import { initialAbility } from './config'

// Read ability from storage (Vue 3 compatible; avoid Vue 2 plugins)
let existingAbility = null
try {
  const raw = typeof localStorage !== 'undefined' ? localStorage.getItem('userData') : null
  if (raw) {
    const parsed = JSON.parse(raw)
    existingAbility = parsed ? parsed.ability : null
  }
} catch (_) {
  existingAbility = null
}

export default new Ability(existingAbility || initialAbility)
