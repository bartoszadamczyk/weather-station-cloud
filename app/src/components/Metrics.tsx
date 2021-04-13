import React, { ReactElement, useContext } from "react"
import { AppContext } from "../providers/AppContext"
import { Table, Tag } from "antd"
import { ColumnsType } from "antd/lib/table/interface"
import { TinyArea } from "@ant-design/charts"
import { MetricRecord, ReadingRecord } from "../reducers/metric"
import { MetricType } from "../types/actions"

const lookUp: Record<string, string> = {
  d1babde1b9b4b22b1d90f07b2a95180d: "LON",
  "364cb313d02c9120c1d8efe788a36245": "KTW"
}

const columns: ColumnsType<MetricRecord> = [
  {
    title: "Device",
    dataIndex: "deviceId",
    fixed: "left",
    render: function renderDeviceName(deviceId) {
      return lookUp[deviceId]
    }
  },
  {
    title: "Type",
    dataIndex: "componentType",
    render: function renderTag(type) {
      return <Tag color={"blue"}>{type.toUpperCase()}</Tag>
    }
  },
  {
    title: "Component ID",
    dataIndex: "componentId"
  },
  {
    title: "Metric",
    dataIndex: "metric",
    render: function renderTag(metric) {
      const metricName = metric.toUpperCase()
      switch (metric) {
        case MetricType.Temperature:
          return <Tag color="red">{metricName}</Tag>
        case MetricType.Humidity:
          return <Tag color="blue">{metricName}</Tag>
        case MetricType.Pressure:
          return <Tag color="gold">{metricName}</Tag>
        case MetricType.Gas:
          return <Tag color="purple">{metricName}</Tag>
        default:
          return <Tag>{metricName}</Tag>
      }
    }
  },
  {
    title: "Value",
    dataIndex: ["latestReading", "value"],
    render: function renderValue(value, metric) {
      switch (metric.metric) {
        case MetricType.Temperature:
          return `${value.toFixed(2)}°C`
        case MetricType.Humidity:
          return `${value.toFixed(2)}%`
        case MetricType.Pressure:
          return `${value.toFixed(0)}hPa`
        default:
          return value
      }
    }
  },
  {
    title: "Chart",
    dataIndex: "liveReadings",
    render: function renderValue(readings: Array<ReadingRecord>) {
      let data = readings.map((reading) => Math.round(reading.value * 100) / 100)
      if (data.length < 20) {
        data = Array(20 - data.length)
          .fill(data[0])
          .concat(data)
      }
      const config = {
        height: 22,
        width: 200,
        autoFit: false,
        data,
        smooth: true,
        limitInPlot: false
      }
      return <TinyArea {...config} />
    }
  }
]

const Metrics = (): ReactElement => {
  const { state } = useContext(AppContext)
  return (
    <div className="Metrics">
      <Table<MetricRecord> dataSource={state.metric.metrics} columns={columns} rowKey={"id"} size={"small"} />
    </div>
  )
}

export default Metrics
