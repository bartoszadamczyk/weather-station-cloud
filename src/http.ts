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
