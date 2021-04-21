type ReturnType = {
  statusCode: number
  body: string
}

export const returnCustom = (statusCode: number, body: string): ReturnType => {
  return { statusCode, body }
}

export const returnOk = (body = "Ok"): ReturnType => {
  return returnCustom(200, body)
}

export const returnOkJSON = (body: unknown): ReturnType => {
  return returnOk(JSON.stringify(body))
}

export const returnBadRequest = (body = "Bad Request"): ReturnType => {
  return returnCustom(400, body)
}

export const returnUnauthorized = (body = "Unauthorized"): ReturnType => {
  return returnCustom(401, body)
}

export const returnForbidden = (body = "Forbidden"): ReturnType => {
  return returnCustom(403, body)
}

export const returnNotFound = (body = "Not Found"): ReturnType => {
  return returnCustom(404, body)
}

export const returnGone = (body = "Gone"): ReturnType => {
  return returnCustom(410, body)
}

export const returnInternalServerError = (body = "Internal Server Error"): ReturnType => {
  return returnCustom(500, body)
}

export const returnNotImplemented = (body = "Not Implemented"): ReturnType => {
  return returnCustom(501, body)
}
