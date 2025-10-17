// Small helper that safely accesses localStorage when available.
export const hasLocalStorage = (): boolean => {
  try {
    return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined' && typeof window.localStorage.getItem === 'function'
  } catch (err) {
    return false
  }
}

export const getItem = (key: string): string | null => {
  if (!hasLocalStorage()) return null
  try {
    return window.localStorage.getItem(key)
  } catch (err) {
    console.warn('localStorage.getItem failed for', key, err)
    return null
  }
}

export const setItem = (key: string, value: string) => {
  if (!hasLocalStorage()) return
  try {
    window.localStorage.setItem(key, value)
  } catch (err) {
    console.warn('localStorage.setItem failed for', key, err)
  }
}

export const removeItem = (key: string) => {
  if (!hasLocalStorage()) return
  try {
    window.localStorage.removeItem(key)
  } catch (err) {
    console.warn('localStorage.removeItem failed for', key, err)
  }
}

export default {
  hasLocalStorage,
  getItem,
  setItem,
  removeItem,
}
