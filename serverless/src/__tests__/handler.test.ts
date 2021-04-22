import chai, { expect } from "chai"
import "mocha"
import sinon from "sinon"
import sinonChai from "sinon-chai"

chai.should()
chai.use(sinonChai)

import * as event from "../event"
import * as clients from "../client"
import { returnOk } from "../http"
import { connectHandler, eventHandler, disconnectHandler, pingHandler } from "../handler"
import contextFactory from "./helpers/contextFactory"
import callbackFactory from "./helpers/callbackFactory"
import sqsRecordFactory from "./helpers/sqsRecordFactory"
import connectionRecordFactory from "./helpers/connectionRecordFactory"
import liveReadingRawEventFactory from "./helpers/liveReadingRawEventFactory"

describe("Test handler", () => {
  describe("Test connectHandler function", () => {
    let putConnectionRecordStub: sinon.SinonStub

    beforeEach(function () {
      putConnectionRecordStub = sinon.stub(clients, "putConnectionRecord")
    })

    afterEach(function () {
      putConnectionRecordStub.restore()
    })

    it("should save connection record", async () => {
      putConnectionRecordStub.resolves()
      const event = {
        requestContext: connectionRecordFactory()
      }
      const result = await connectHandler(event, contextFactory(), callbackFactory())
      putConnectionRecordStub.should.have.been.calledOnceWith(event.requestContext.connectionId)
      expect(result).to.be.eql(returnOk())
    })
  })

  describe("Test disconnectHandler function", () => {
    let deleteConnectionRecordStub: sinon.SinonStub

    beforeEach(function () {
      deleteConnectionRecordStub = sinon.stub(clients, "deleteConnectionRecord")
    })

    afterEach(function () {
      deleteConnectionRecordStub.restore()
    })

    it("should remove connection record", async () => {
      deleteConnectionRecordStub.resolves()
      const event = {
        requestContext: connectionRecordFactory()
      }
      const result = await disconnectHandler(event, contextFactory(), callbackFactory())
      deleteConnectionRecordStub.should.have.been.calledOnceWith(event.requestContext.connectionId)
      expect(result).to.be.eql(returnOk())
    })
  })

  describe("Test pingHandler function", () => {
    it("should return pong msg", async () => {
      const result = await pingHandler({}, contextFactory(), callbackFactory())
      expect(result.statusCode).to.be.equal(200)
      expect(JSON.parse(result.body)).to.be.eql({ action: "pong" })
    })
  })

  describe("Test eventHandler function", () => {
    let handleEventStub: sinon.SinonStub

    beforeEach(function () {
      handleEventStub = sinon.stub(event, "handleEvent")
    })

    afterEach(function () {
      handleEventStub.restore()
    })

    it("should work for no records", async () => {
      handleEventStub.returnsArg(0)
      const event = { Records: [] }
      await eventHandler(event, contextFactory(), callbackFactory())
      handleEventStub.should.have.not.been.called
    })

    it("should work for one record", async () => {
      const event = {
        Records: [sqsRecordFactory(liveReadingRawEventFactory())]
      }
      handleEventStub.returnsArg(0)
      await eventHandler(event, contextFactory(), callbackFactory())
      handleEventStub.should.have.been.calledOnceWith(undefined, event.Records[0].body)
    })

    it("should work for more than one record", async () => {
      const connections = [connectionRecordFactory()]
      const event = {
        Records: [sqsRecordFactory(liveReadingRawEventFactory()), sqsRecordFactory(liveReadingRawEventFactory())]
      }
      handleEventStub.resolves(connections)
      await eventHandler(event, contextFactory(), callbackFactory())
      handleEventStub.should.have.been.calledTwice
      handleEventStub.should.have.been.calledWith(undefined, event.Records[0].body)
      handleEventStub.should.have.been.calledWith(connections, event.Records[1].body)
    })
  })
})
