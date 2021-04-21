import chai, { expect } from "chai"
import "mocha"
import sinon from "sinon"
import sinonChai from "sinon-chai"

chai.should()
chai.use(sinonChai)

import * as actions from "../actions"
import * as clients from "../clients"
import { connectHandler, dataHandler, disconnectHandler, pingHandler } from "../handler"
import liveReadingActionFactory from "./helpers/liveReadingActionFactory"
import { returnOk } from "../http"
import connectionRecordFactory from "./helpers/connectionRecordFactory"
import contextFactory from "./helpers/contextFactory"
import callbackFactory from "./helpers/callbackFactory"
import sqsRecordFactory from "./helpers/sqsRecordFactory"
import { ActionType } from "../types/actions"
import pongActionFactory from "./helpers/pongActionFactory"

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
      expect(JSON.parse(result.body).action).to.be.eql("pong")
    })
  })

  describe("Test dataHandler function", () => {
    let getConnectionRecordsStub: sinon.SinonStub
    let sendToClientsStub: sinon.SinonStub
    let enrichLiveReadingActionStub: sinon.SinonStub

    beforeEach(function () {
      getConnectionRecordsStub = sinon.stub(clients, "getConnectionRecords")
      sendToClientsStub = sinon.stub(clients, "sendToClients")
      enrichLiveReadingActionStub = sinon.stub(actions, "enrichLiveReadingAction")
    })

    afterEach(function () {
      getConnectionRecordsStub.restore()
      sendToClientsStub.restore()
      enrichLiveReadingActionStub.restore()
    })

    it("should not send to client if no records", async () => {
      const connections = connectionRecordFactory()
      getConnectionRecordsStub.resolves(connections)
      sendToClientsStub.returnsArg(0)
      enrichLiveReadingActionStub.returnsArg(0)
      const event = { Records: [] }
      await dataHandler(event, contextFactory(), callbackFactory())
      getConnectionRecordsStub.should.have.been.calledOnce
      sendToClientsStub.should.have.not.been.called
      enrichLiveReadingActionStub.should.have.not.been.called
    })

    it("should send to client correct record", async () => {
      const connections = connectionRecordFactory()
      getConnectionRecordsStub.resolves(connections)
      sendToClientsStub.returnsArg(0)
      enrichLiveReadingActionStub.returnsArg(0)
      const event = {
        Records: [sqsRecordFactory(liveReadingActionFactory())]
      }
      await dataHandler(event, contextFactory(), callbackFactory())
      getConnectionRecordsStub.should.have.been.calledOnce
      sendToClientsStub.should.have.been.calledOnce
      enrichLiveReadingActionStub.should.have.been.calledOnce
    })

    it("should send to client correct records", async () => {
      const connections = connectionRecordFactory()
      getConnectionRecordsStub.resolves(connections)
      sendToClientsStub.returnsArg(0)
      enrichLiveReadingActionStub.returnsArg(0)
      const event = {
        Records: [sqsRecordFactory(liveReadingActionFactory()), sqsRecordFactory(liveReadingActionFactory())]
      }
      await dataHandler(event, contextFactory(), callbackFactory())
      getConnectionRecordsStub.should.have.been.calledOnce
      sendToClientsStub.should.have.been.calledTwice
      enrichLiveReadingActionStub.should.have.been.calledTwice
    })

    it("should not send to client for pong action type", async () => {
      const connections = connectionRecordFactory()
      getConnectionRecordsStub.resolves(connections)
      sendToClientsStub.returnsArg(0)
      enrichLiveReadingActionStub.returnsArg(0)
      const event = {
        Records: [sqsRecordFactory(liveReadingActionFactory()), sqsRecordFactory(pongActionFactory())]
      }
      await dataHandler(event, contextFactory(), callbackFactory())
      getConnectionRecordsStub.should.have.been.calledOnce
      sendToClientsStub.should.have.been.calledOnce
      enrichLiveReadingActionStub.should.have.been.calledOnce
    })

    it("should not send to client wrong records", async () => {
      const connections = connectionRecordFactory()
      getConnectionRecordsStub.resolves(connections)
      sendToClientsStub.returnsArg(0)
      enrichLiveReadingActionStub.returnsArg(0)
      const event = {
        Records: [
          sqsRecordFactory(liveReadingActionFactory()),
          sqsRecordFactory({ ...liveReadingActionFactory(), module_type: "foo" })
        ]
      }
      await dataHandler(event, contextFactory(), callbackFactory())
      getConnectionRecordsStub.should.have.been.calledOnce
      sendToClientsStub.should.have.been.calledOnce
      enrichLiveReadingActionStub.should.have.been.calledOnce
    })
  })
})
