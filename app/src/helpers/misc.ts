export function sortBy<T extends Record<string | symbol | number, unknown>>(array: Array<T>, key: keyof T): Array<T> {
  return [...array].sort((a: T, b: T) => (a[key] > b[key] ? 1 : b[key] > a[key] ? -1 : 0))
}
