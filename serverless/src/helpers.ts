export const getEnvVar = (name: string): string | undefined => {
  return process.env[name]
}

export const getReqEnvVar = (name: string): string => {
  const envVar = getEnvVar(name)
  if (!envVar) throw new Error(`Missing env var: ${name}`)
  return envVar
}

export const safeObjectAsyncLoop = async <T extends string | symbol | number, U>(
  records: Record<T, U>,
  callback: (key: T, value: U) => Promise<void>
): Promise<void> => {
  for (const key in records) {
    if (Object.prototype.hasOwnProperty.call(records, key)) {
      await callback(key, records[key])
    }
  }
}

export function sortBy<T extends Record<string | symbol | number, unknown>>(array: Array<T>, key: keyof T): Array<T> {
  return [...array].sort((a: T, b: T) => (a[key] > b[key] ? 1 : b[key] > a[key] ? -1 : 0))
}

export const dateToString = (date: Date): string => date.toISOString().slice(0, 23)
export const dateToTimestamp = (date: Date): number => date.getTime()
