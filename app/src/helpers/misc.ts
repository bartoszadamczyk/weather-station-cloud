// type NotEmptyArray<T> = [T, ...T[]]
// <R,> in jsx

type GenericRecord = Record<string | symbol | number, unknown>

export function sortBy<T extends GenericRecord>(array: Array<T>, key: keyof T): Array<T> {
  return [...array].sort((a: T, b: T) => (a[key] > b[key] ? 1 : b[key] > a[key] ? -1 : 0))
}

export function findById<T extends GenericRecord>(array: Array<T>, id: string, key: keyof T = "id"): T | undefined {
  return array.find((m) => m[key] === id)
}

export function getLastValues<T extends GenericRecord>(array: Array<T>, n = 1): Array<T> {
  return array.slice(-n)
}

export function getLastValue<T extends GenericRecord>(array: Array<T>): T {
  return getLastValues(array, 1)[0]
}

export const getKey = <R>(obj: R, keys: Array<keyof R>) => keys.map((key) => obj[key]).join("_")
