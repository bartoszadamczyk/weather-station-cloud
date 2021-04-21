import chai, { expect } from "chai"
import "mocha"
import sinon from "sinon"
import sinonChai from "sinon-chai"

chai.should()
chai.use(sinonChai)

import * as mappings from "../mappings"
import { enrichLiveReadingAction } from "../actions"
import mappingFactory from "./helpers/mappingFactory"
import liveReadingActionFactory from "./helpers/liveReadingActionFactory"

describe("Test actions", () => {
  describe("Test enrichLiveReadingAction function", () => {
    let getMappingRecordStub: sinon.SinonStub

    beforeEach(function () {
      getMappingRecordStub = sinon.stub(mappings, "getMappingRecord")
    })

    afterEach(function () {
      getMappingRecordStub.restore()
    })

    it("should work when mapping exists", async () => {
      const liveReadingAction = liveReadingActionFactory()
      const mappingRecord = mappingFactory()
      getMappingRecordStub.resolves(mappingRecord)
      const result = await enrichLiveReadingAction(liveReadingAction)
      getMappingRecordStub.should.have.been.calledTwice
      getMappingRecordStub.should.have.been.calledWith(liveReadingAction.device_id)
      getMappingRecordStub.should.have.been.calledWith(liveReadingAction.device_id, liveReadingAction.module_id)
      expect(result).to.be.eql({
        ...liveReadingAction,
        device_name: mappingRecord.name,
        module_name: mappingRecord.name
      })
    })

    it("should work when mapping is missing", async () => {
      const liveReadingAction = liveReadingActionFactory()
      getMappingRecordStub.resolves()
      const result = await enrichLiveReadingAction(liveReadingAction)
      getMappingRecordStub.should.have.been.calledTwice
      getMappingRecordStub.should.have.been.calledWith(liveReadingAction.device_id)
      getMappingRecordStub.should.have.been.calledWith(liveReadingAction.device_id, liveReadingAction.module_id)
      expect(result.device_name).to.be.undefined
      expect(result.module_name).to.be.undefined
    })
  })
})
