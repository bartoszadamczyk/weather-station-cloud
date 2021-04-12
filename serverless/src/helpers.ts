export const getEnvVar = (name: string): string => {
  const envVar = process.env[name]
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

export const dateToString = (date: Date): string => date.toISOString().slice(0, 10)
export const dateToTimestamp = (date: Date): number => date.getTime()
