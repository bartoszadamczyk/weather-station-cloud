import chai, { expect } from "chai"
import * as faker from "faker"
import "mocha"
import sinon from "sinon"
import sinonChai from "sinon-chai"

chai.should()
chai.use(sinonChai)

import * as aws from "../aws"
import * as Sentry from "@sentry/serverless"
import * as client from "../client"
import connectionRecordFactory from "./helpers/connectionRecordFactory"

describe("Test client", () => {
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
      const result = await client.getConnectionRecords()
      scanRecordsStub.should.have.been.calledOnce
      expect(result).to.be.eql(examples)
    })

    it("should work when object is missing", async () => {
      scanRecordsStub.resolves([])
      const result = await client.getConnectionRecords()
      scanRecordsStub.should.have.been.calledOnce
      expect(result).to.be.eql([])
    })

    it("should work when there is more than one object in db", async () => {
      const examples = [connectionRecordFactory(), connectionRecordFactory()]
      scanRecordsStub.resolves(examples)
      const result = await client.getConnectionRecords()
      scanRecordsStub.should.have.been.calledOnce
      expect(result).to.be.eql(examples)
    })

    it("should work when object has missing properties", async () => {
      const examples = [{ foo: "foo" }, connectionRecordFactory()]
      scanRecordsStub.resolves(examples)
      const result = await client.getConnectionRecords()
      scanRecordsStub.should.have.been.calledOnce
      expect(result).to.be.eql([examples[1]])
    })

    it("should work when object has more properties", async () => {
      const examples = [{ ...connectionRecordFactory(), foo: "bar" }, connectionRecordFactory()]
      scanRecordsStub.resolves(examples)
      const result = await client.getConnectionRecords()
      scanRecordsStub.should.have.been.calledOnce
      expect(result).to.be.eql(examples)
    })
  })

  describe("Test sendToClients function", () => {
    const stale = { statusCode: 410 }
    const error = { statusCode: 500 }

    let getConnectionRecordsStub: sinon.SinonStub
    let sendToClientStub: sinon.SinonStub

    beforeEach(function () {
      getConnectionRecordsStub = sinon.stub(client, "getConnectionRecords")
      sendToClientStub = sinon.stub(client, "sendToClient")
    })

    afterEach(function () {
      getConnectionRecordsStub.restore()
      sendToClientStub.restore()
    })

    it("should work with connections provided", async () => {
      const connections = [connectionRecordFactory(), connectionRecordFactory()]
      getConnectionRecordsStub.resolves(connections)
      const data = faker.datatype.string()
      sendToClientStub.resolves()
      const result = await client.sendToClients(connections, data)
      getConnectionRecordsStub.should.have.not.been.called
      sendToClientStub.should.have.been.calledTwice
      sendToClientStub.should.have.been.calledWith(connections[0], data)
      sendToClientStub.should.have.been.calledWith(connections[1], data)
      expect(result).to.be.eql(connections)
    })

    it("should work with connections not provided", async () => {
      const connections = [connectionRecordFactory(), connectionRecordFactory()]
      getConnectionRecordsStub.resolves(connections)
      const data = faker.datatype.string()
      sendToClientStub.resolves()
      const result = await client.sendToClients(undefined, data)
      getConnectionRecordsStub.should.have.been.calledOnce
      sendToClientStub.should.have.been.calledTwice
      sendToClientStub.should.have.been.calledWith(connections[0], data)
      sendToClientStub.should.have.been.calledWith(connections[1], data)
      expect(result).to.be.eql(connections)
    })

    it("should work when connection is stale", async () => {
      const connections = [connectionRecordFactory(), connectionRecordFactory(), connectionRecordFactory()]
      getConnectionRecordsStub.resolves(connections)
      const data = faker.datatype.string()
      sendToClientStub.onFirstCall().resolves()
      sendToClientStub.onSecondCall().resolves(stale)
      sendToClientStub.onThirdCall().resolves()
      const result = await client.sendToClients(connections, data)
      getConnectionRecordsStub.should.not.have.been.called
      sendToClientStub.should.have.been.calledThrice
      sendToClientStub.should.have.been.calledWith(connections[0], data)
      sendToClientStub.should.have.been.calledWith(connections[1], data)
      sendToClientStub.should.have.been.calledWith(connections[2], data)
      expect(result).to.be.eql([connections[0], connections[2]])
    })

    it("should work when connection is throws", async () => {
      const connections = [connectionRecordFactory(), connectionRecordFactory(), connectionRecordFactory()]
      getConnectionRecordsStub.resolves(connections)
      const data = faker.datatype.string()
      sendToClientStub.onFirstCall().resolves()
      sendToClientStub.onSecondCall().resolves(error)
      sendToClientStub.onThirdCall().resolves()
      const result = await client.sendToClients(connections, data)
      getConnectionRecordsStub.should.not.have.been.called
      sendToClientStub.should.have.been.calledThrice
      sendToClientStub.should.have.been.calledWith(connections[0], data)
      sendToClientStub.should.have.been.calledWith(connections[1], data)
      sendToClientStub.should.have.been.calledWith(connections[2], data)
      expect(result).to.be.eql(connections)
    })
  })

  describe("Test sendToClient function", () => {
    const stale = { statusCode: 410 }
    const error = { statusCode: 500 }

    let postToConnectionStub: sinon.SinonStub
    let deleteConnectionRecordStub: sinon.SinonStub
    let captureExceptionStub: sinon.SinonStub
    let captureMessageStub: sinon.SinonStub

    beforeEach(function () {
      postToConnectionStub = sinon.stub(aws, "postToConnection")
      deleteConnectionRecordStub = sinon.stub(client, "deleteConnectionRecord")
      captureExceptionStub = sinon.stub(Sentry, "captureException")
      captureMessageStub = sinon.stub(Sentry, "captureMessage")
    })

    afterEach(function () {
      postToConnectionStub.restore()
      deleteConnectionRecordStub.restore()
      captureExceptionStub.restore()
      captureMessageStub.restore()
    })

    it("should work when connection exists", async () => {
      const connection = connectionRecordFactory()
      const data = faker.datatype.string()
      postToConnectionStub.resolves()
      const result = await client.sendToClient(connection, data)
      postToConnectionStub.should.have.been.calledOnceWith(connection.connectionId, data)
      deleteConnectionRecordStub.should.not.have.been.called
      captureExceptionStub.should.not.have.been.called
      captureMessageStub.should.not.have.been.called
      expect(result).to.be.undefined
    })

    it("should work when connection is stale", async () => {
      const connection = connectionRecordFactory()
      const data = faker.datatype.string()
      postToConnectionStub.rejects(stale)
      const result = await client.sendToClient(connection, data)
      postToConnectionStub.should.have.been.calledOnceWith(connection.connectionId, data)
      deleteConnectionRecordStub.should.have.been.calledOnceWith(connection.connectionId)
      captureExceptionStub.should.not.have.been.called
      captureMessageStub.should.have.been.calledOnce
      expect(result).to.be.eql(stale)
    })

    it("should work when connection is throws", async () => {
      const connection = connectionRecordFactory()
      const data = faker.datatype.string()
      postToConnectionStub.rejects(error)
      const result = await client.sendToClient(connection, data)
      postToConnectionStub.should.have.been.calledOnceWith(connection.connectionId, data)
      deleteConnectionRecordStub.should.not.have.been.called
      captureExceptionStub.should.have.been.calledOnceWith(error)
      captureMessageStub.should.not.have.been.called
      expect(result).to.be.eql(error)
    })
  })
})
