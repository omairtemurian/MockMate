const KEY = 'mockmate_user_id'

/**
 * Returns the user's persistent UUID from localStorage.
 * Creates and stores a new one on the very first visit.
 */
export function getUserId() {
  let id = localStorage.getItem(KEY)
  if (!id) {
    id = crypto.randomUUID()          // built-in browser API — no library needed
    localStorage.setItem(KEY, id)
  }
  return id
}
