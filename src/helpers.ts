export const getEnvVar = (name: string): string => {
  const envVar = process.env[name]
  if (!envVar) throw new Error(`Missing env var: ${name}`)
  return envVar
}

export const safeObjectAsyncLoop = async <T extends string | symbol | number, U>(
  records: Record<T, U>,
  cb: (key: T, value: U) => Promise<void>
): Promise<void> => {
  for (const key in records) {
    if (Object.prototype.hasOwnProperty.call(records, key)) {
      await cb(key, records[key])
    }
  }
}

export const dateToString = (date: Date): string => date.toISOString().slice(0, 10)
export const dateToUnixTimestamp = (date: Date): number => date.getTime() / 1000

export const returnCustom = (statusCode: number, body: string) => {
  return { statusCode, body }
}

export const returnOk = (body: string = "Ok") => {
  return returnCustom(200, body)
}

export const returnOkJSON = (body: any = "Ok") => {
  return returnOk(JSON.stringify(body))
}

export const returnBadRequest = (body: string = "Bad Request") => {
  return returnCustom(400, body)
}

export const returnUnauthorized = (body: string = "Unauthorized") => {
  return returnCustom(401, body)
}

export const returnForbidden = (body: string = "Forbidden") => {
  return returnCustom(403, body)
}

export const returnNotFound = (body: string = "Not Found") => {
  return returnCustom(404, body)
}

export const returnInternalServerError = (body: string = "Internal Server Error") => {
  return returnCustom(500, body)
}

export const returnNotImplemented = (body: string = "Not Implemented") => {
  return returnCustom(501, body)
}
