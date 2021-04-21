import chai, { expect } from "chai"
import * as faker from "faker"
import "mocha"
import sinon from "sinon"

import sinonChai from "sinon-chai"

chai.should()

chai.use(sinonChai)
import * as aws from "../aws"
import * as Sentry from "@sentry/serverless"
import { getConnectionRecords, sendToClients } from "../clients"
import connectionRecordFactory from "./helpers/connectionRecordFactory"

describe("Test clients", () => {
  describe("Test connectionRecordFactory function", () => {
    let scanRecordsStub: sinon.SinonStub

    beforeEach(function () {
      scanRecordsStub = sinon.stub(aws, "scanRecords")
    })

    afterEach(function () {
      scanRecordsStub.restore()
    })

    it("should work when object exists", async () => {
      const examples = [connectionRecordFactory()]
      scanRecordsStub.resolves(examples)
      const result = await getConnectionRecords()
      scanRecordsStub.should.have.been.calledOnce
      expect(result).to.be.eql(examples)
    })

    it("should work when object is missing", async () => {
      scanRecordsStub.resolves([])
      const result = await getConnectionRecords()
      scanRecordsStub.should.have.been.calledOnce
      expect(result).to.be.eql([])
    })

    it("should work when there is more than one object in db", async () => {
      const examples = [connectionRecordFactory(), connectionRecordFactory()]
      scanRecordsStub.resolves(examples)
      const result = await getConnectionRecords()
      scanRecordsStub.should.have.been.calledOnce
      expect(result).to.be.eql(examples)
    })

    it("should work when object has missing properties", async () => {
      const examples = [{ foo: "foo" }, connectionRecordFactory()]
      scanRecordsStub.resolves(examples)
      const result = await getConnectionRecords()
      scanRecordsStub.should.have.been.calledOnce
      expect(result).to.be.eql([examples[1]])
    })

    it("should work when object has more properties", async () => {
      const examples = [{ ...connectionRecordFactory(), foo: "bar" }, connectionRecordFactory()]
      scanRecordsStub.resolves(examples)
      const result = await getConnectionRecords()
      scanRecordsStub.should.have.been.calledOnce
      expect(result).to.be.eql(examples)
    })
  })

  describe("Test sendToClients function", () => {
    let postToConnectionStub: sinon.SinonStub
    let deleteRecordStub: sinon.SinonStub
    let captureExceptionStub: sinon.SinonStub
    let captureMessageStub: sinon.SinonStub
    const success = { statusCode: 200 }
    const stale = { statusCode: 410 }
    const error = { statusCode: 500 }

    beforeEach(function () {
      postToConnectionStub = sinon.stub(aws, "postToConnection")
      deleteRecordStub = sinon.stub(aws, "deleteRecord")
      captureExceptionStub = sinon.stub(Sentry, "captureException")
      captureMessageStub = sinon.stub(Sentry, "captureMessage")
    })

    afterEach(function () {
      postToConnectionStub.restore()
      deleteRecordStub.restore()
      captureExceptionStub.restore()
      captureMessageStub.restore()
    })

    it("should work when connection exists", async () => {
      const connections = [connectionRecordFactory(), connectionRecordFactory()]
      const data = faker.datatype.string()
      postToConnectionStub.resolves(success)
      const result = await sendToClients(connections, data)
      postToConnectionStub.should.have.been.calledTwice
      postToConnectionStub.should.have.been.calledWith(connections[0].connectionId, data)
      postToConnectionStub.should.have.been.calledWith(connections[1].connectionId, data)
      deleteRecordStub.should.not.have.been.called
      captureExceptionStub.should.not.have.been.called
      captureMessageStub.should.not.have.been.called
      expect(result).to.be.eql(connections)
    })

    it("should work when connection is stale", async () => {
      const connections = [connectionRecordFactory(), connectionRecordFactory(), connectionRecordFactory()]
      const data = faker.datatype.string()
      postToConnectionStub.onFirstCall().resolves(success)
      postToConnectionStub.onSecondCall().rejects(stale)
      postToConnectionStub.onThirdCall().resolves(success)
      const result = await sendToClients(connections, data)
      postToConnectionStub.should.have.been.calledThrice
      postToConnectionStub.should.have.been.calledWith(connections[0].connectionId, data)
      postToConnectionStub.should.have.been.calledWith(connections[1].connectionId, data)
      postToConnectionStub.should.have.been.calledWith(connections[2].connectionId, data)
      deleteRecordStub.should.have.been.calledOnceWith(sinon.match.any, { connectionId: connections[1].connectionId })
      captureExceptionStub.should.not.have.been.called
      captureMessageStub.should.have.been.calledOnce
      expect(result).to.be.eql([connections[0], connections[2]])
    })

    it("should work when connection is throws", async () => {
      const connections = [connectionRecordFactory(), connectionRecordFactory(), connectionRecordFactory()]
      const data = faker.datatype.string()
      postToConnectionStub.onFirstCall().resolves(success)
      postToConnectionStub.onSecondCall().rejects(error)
      postToConnectionStub.onThirdCall().resolves(success)
      const result = await sendToClients(connections, data)
      postToConnectionStub.should.have.been.calledThrice
      postToConnectionStub.should.have.been.calledWith(connections[0].connectionId, data)
      postToConnectionStub.should.have.been.calledWith(connections[1].connectionId, data)
      postToConnectionStub.should.have.been.calledWith(connections[2].connectionId, data)
      deleteRecordStub.should.not.have.been.called
      captureExceptionStub.should.have.been.calledOnceWith(error)
      captureMessageStub.should.not.have.been.called
      expect(result).to.be.eql(connections)
    })
  })
})
