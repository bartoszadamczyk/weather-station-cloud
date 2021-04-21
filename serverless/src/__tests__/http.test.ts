import { expect } from "chai"
import "mocha"
import itParam from "mocha-param"
import * as faker from "faker"

import {
  returnCustom,
  returnOk,
  returnOkJSON,
  returnBadRequest,
  returnUnauthorized,
  returnForbidden,
  returnNotFound,
  returnGone,
  returnInternalServerError,
  returnNotImplemented
} from "../http"

describe("Test HTTP helpers", () => {
  describe("Test function returnCustom", () => {
    it("should return correct object", () => {
      const statusCode = faker.datatype.number()
      const body = faker.datatype.string()
      const result = returnCustom(statusCode, body)
      expect(result).to.eql({ statusCode, body })
    })
  })

  describe("Test function returnOkJSON", () => {
    it("should return correct object", () => {
      const statusCode = 200
      const body = { someProp: faker.datatype.string() }
      const result = returnOkJSON(body)
      expect(result).to.eql({ statusCode, body: JSON.stringify(body) })
    })
  })

  describe("Test functions with status codes", () => {
    const functions = [
      { func: returnOk, name: "returnOk", statusCode: 200, body: "Ok" },
      { func: returnBadRequest, name: "returnBadRequest", statusCode: 400, body: "Bad Request" },
      { func: returnUnauthorized, name: "returnUnauthorized", statusCode: 401, body: "Unauthorized" },
      { func: returnForbidden, name: "returnForbidden", statusCode: 403, body: "Forbidden" },
      { func: returnNotFound, name: "returnNotFound", statusCode: 404, body: "Not Found" },
      { func: returnGone, name: "returnGone", statusCode: 410, body: "Gone" },
      {
        func: returnInternalServerError,
        name: "returnInternalServerError",
        statusCode: 500,
        body: "Internal Server Error"
      },
      { func: returnNotImplemented, name: "returnNotImplemented", statusCode: 501, body: "Not Implemented" }
    ]

    itParam("Function ${value.name} should return correct default object", functions, ({ func, statusCode, body }) => {
      const result = func()
      expect(result).to.eql({ statusCode, body })
    })
    itParam(
      "Function ${value.name} should return correct object with passed body",
      functions,
      ({ func, statusCode }) => {
        const body = faker.datatype.string()
        const result = func(body)
        expect(result).to.eql({ statusCode, body })
      }
    )
  })
})
