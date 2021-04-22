import chai, { expect } from "chai"
import "mocha"
import sinon from "sinon"
import sinonChai from "sinon-chai"

chai.should()
chai.use(sinonChai)

import * as aws from "../aws"
import { getMappingRecord } from "../mapping"
import mappingFactory from "./helpers/mappingFactory"

describe("Test mapping", () => {
  describe("Test getMappingRecord function", () => {
    let getRecordStub: sinon.SinonStub

    beforeEach(function () {
      getRecordStub = sinon.stub(aws, "getRecord")
    })

    afterEach(function () {
      getRecordStub.restore()
    })

    it("should work when object exists in db", async () => {
      const example = mappingFactory()
      getRecordStub.resolves([example])
      const result = await getMappingRecord(example.deviceId, example.moduleId)
      getRecordStub.should.have.been.calledOnce
      expect(result).to.be.equal(example)
    })

    it("should default moduleId to device", async () => {
      const example = mappingFactory({ moduleId: "device" })
      getRecordStub.resolves([example])
      const result = await getMappingRecord(example.deviceId)
      getRecordStub.should.have.been.calledOnceWith(sinon.match.any, sinon.match.any, {
        ":deviceId": example.deviceId,
        ":moduleId": example.moduleId
      })
      expect(result).to.be.equal(example)
    })

    it("should work when object is missing in db", async () => {
      const example = mappingFactory()
      getRecordStub.resolves([])
      const result = await getMappingRecord(example.deviceId, example.moduleId)
      getRecordStub.should.have.been.calledOnce
      expect(result).to.be.undefined
    })

    it("should use first object in db", async () => {
      // This should not happen in DynamoDB, but just in case
      const examples = [mappingFactory(), mappingFactory()]
      getRecordStub.resolves(examples)
      const result = await getMappingRecord(examples[0].deviceId, examples[0].moduleId)
      getRecordStub.should.have.been.calledOnce
      expect(result).to.be.equal(examples[0])
    })

    it("should skipp objects with missing properties", async () => {
      const examples = [{ deviceId: "foo", moduleId: "bar" }, mappingFactory()]
      getRecordStub.resolves(examples)
      const result = await getMappingRecord(examples[0].deviceId, examples[0].moduleId)
      getRecordStub.should.have.been.calledOnce
      expect(result).to.be.equal(examples[1])
    })

    it("should work when object in db has more properties", async () => {
      const examples = [{ ...mappingFactory(), foo: "bar" }, mappingFactory()]
      getRecordStub.resolves(examples)
      const result = await getMappingRecord(examples[0].deviceId, examples[0].moduleId)
      getRecordStub.should.have.been.calledOnce
      expect(result).to.be.equal(examples[0])
    })
  })
})
