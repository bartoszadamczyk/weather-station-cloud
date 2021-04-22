import chai, { expect } from "chai"
import "mocha"
import sinon from "sinon"
import sinonChai from "sinon-chai"

chai.should()
chai.use(sinonChai)

import * as mappings from "../mapping"
import * as clients from "../client"
import * as event from "../event"
import mappingFactory from "./helpers/mappingFactory"
import connectionRecordFactory from "./helpers/connectionRecordFactory"
import liveReadingEventFactory from "./helpers/liveReadingEventFactory"
import liveReadingRawEventFactory from "./helpers/liveReadingRawEventFactory"
import { parseEvent } from "../types/event"

describe("Test event", () => {
  describe("Test enrichLiveReadingAction function", () => {
    let getMappingRecordStub: sinon.SinonStub

    beforeEach(function () {
      getMappingRecordStub = sinon.stub(mappings, "getMappingRecord")
    })

    afterEach(function () {
      getMappingRecordStub.restore()
    })

    it("should work when mapping exists", async () => {
      const liveReadingAction = liveReadingEventFactory()
      const mappingRecord = mappingFactory()
      getMappingRecordStub.resolves(mappingRecord)
      const result = await event.enrichLiveReadingEvent(liveReadingAction)
      getMappingRecordStub.should.have.been.calledTwice
      getMappingRecordStub.should.have.been.calledWith(liveReadingAction.deviceId)
      getMappingRecordStub.should.have.been.calledWith(liveReadingAction.deviceId, liveReadingAction.moduleId)
      expect(result).to.be.eql({
        ...liveReadingAction,
        deviceName: mappingRecord.name,
        moduleName: mappingRecord.name
      })
    })

    it("should work when mapping is missing", async () => {
      const liveReadingAction = liveReadingEventFactory()
      getMappingRecordStub.resolves()
      const result = await event.enrichLiveReadingEvent(liveReadingAction)
      getMappingRecordStub.should.have.been.calledTwice
      getMappingRecordStub.should.have.been.calledWith(liveReadingAction.deviceId)
      getMappingRecordStub.should.have.been.calledWith(liveReadingAction.deviceId, liveReadingAction.moduleId)
      expect(result.deviceName).to.be.undefined
      expect(result.moduleName).to.be.undefined
    })
  })

  describe("Test eventHandler function", () => {
    let sendToClientsStub: sinon.SinonStub
    let enrichLiveReadingEventStub: sinon.SinonStub

    beforeEach(function () {
      sendToClientsStub = sinon.stub(clients, "sendToClients")
      enrichLiveReadingEventStub = sinon.stub(event, "enrichLiveReadingEvent")
      enrichLiveReadingEventStub.returnsArg(0)
    })

    afterEach(function () {
      sendToClientsStub.restore()
      enrichLiveReadingEventStub.restore()
    })

    it("should discard wrong events", async () => {
      const connections = [connectionRecordFactory()]
      sendToClientsStub.returnsArg(0)
      const rawEvent = { ...liveReadingRawEventFactory(), module_type: "foo" }
      const result = await event.handleEvent(connections, JSON.stringify(rawEvent))
      expect(result).to.be.equal(connections)
      sendToClientsStub.should.have.not.been.called
      enrichLiveReadingEventStub.should.have.not.been.called
    })

    it("should send to client correct record", async () => {
      const connections = [connectionRecordFactory()]
      sendToClientsStub.returnsArg(0)
      const rawEvent = JSON.stringify(liveReadingRawEventFactory())
      const result = await event.handleEvent(connections, rawEvent)
      expect(result).to.be.equal(connections)
      sendToClientsStub.should.have.not.been.calledOnceWith(connections, parseEvent(rawEvent))
      enrichLiveReadingEventStub.should.have.been.calledOnceWith(parseEvent(rawEvent))
    })
  })
})
