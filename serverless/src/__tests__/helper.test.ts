import chai, { expect } from "chai"
import "mocha"
import itParam from "mocha-param"
import sinon from "sinon"
import sinonChai from "sinon-chai"

chai.should()
chai.use(sinonChai)

import { safeObjectAsyncLoop, sortBy, dateToString, dateToTimestamp } from "../helper"
import { describe } from "mocha"

describe("Test helpers", () => {
  describe("Test safeObjectAsyncLoop function", () => {
    it("should work for empty object", async () => {
      const spy = sinon.spy()
      const obj = {}
      await safeObjectAsyncLoop(obj, spy)
      spy.should.not.have.been.called
    })
    it("should work for object with one prop", async () => {
      const spy = sinon.spy()
      const obj = { foo: "bar" }
      await safeObjectAsyncLoop(obj, spy)
      spy.should.have.been.calledOnceWith("foo", "bar")
    })
    it("should work for object with more than one prop", async () => {
      const spy = sinon.spy()
      const obj = { foo: "bar", baz: "qux" }
      await safeObjectAsyncLoop(obj, spy)
      spy.should.have.been.calledTwice
      spy.should.have.been.calledWith("foo", "bar")
      spy.should.have.been.calledWith("baz", "qux")
    })
  })

  describe("Test sortBy function", () => {
    describe("Test multiple versions", () => {
      const obj1a = { id: 1, uniqueId: "a" }
      const obj2a = { id: 2, uniqueId: "a" }
      const obj3a = { id: 3, uniqueId: "a" }
      const obj3b = { id: 3, uniqueId: "b" }
      const obj4a = { id: 4, uniqueId: "a" }

      const versions = [
        { id: 1, in: [], out: [] },
        { id: 2, in: [obj1a], out: [obj1a] },
        { id: 3, in: [obj1a, obj2a], out: [obj1a, obj2a] },
        { id: 4, in: [obj2a, obj1a], out: [obj1a, obj2a] },
        { id: 5, in: [obj1a, obj2a, obj3a, obj3b, obj4a], out: [obj1a, obj2a, obj3a, obj3b, obj4a] },
        { id: 5, in: [obj1a, obj3a, obj3b, obj2a, obj4a], out: [obj1a, obj2a, obj3a, obj3b, obj4a] },
        // When ids are same order should not be changed
        { id: 6, in: [obj1a, obj2a, obj3b, obj3a, obj4a], out: [obj1a, obj2a, obj3b, obj3a, obj4a] },
        { id: 7, in: [obj4a, obj3b, obj3a, obj2a, obj1a], out: [obj1a, obj2a, obj3b, obj3a, obj4a] }
      ]
      itParam("should work for version ${value.id}", versions, (version) => {
        const result = sortBy(version.in, "id")
        expect(result).to.eql(version.out)
      })
    })
  })

  describe("Test dateToString function", () => {
    it("should return correct string", () => {
      const iso = "2020-02-20T20:20:20.123"
      const d = new Date(2020, 1, 20, 20, 20, 20, 123)
      const result = dateToString(d)
      expect(result).to.eql(iso)
    })
  })
  describe("Test dateToTimestamp function", () => {
    it("should return correct number", () => {
      const timestamp = 1582230020123
      const d = new Date(2020, 1, 20, 20, 20, 20, 123)
      const result = dateToTimestamp(d)
      expect(result).to.eql(timestamp)
    })
  })
})
