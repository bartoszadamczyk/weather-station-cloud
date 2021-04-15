import React, { ReactElement, useContext, useMemo } from "react"
import { AppContext } from "../providers/AppContext"
import { Table, Tag } from "antd"
import { ColumnsType } from "antd/lib/table/interface"
import { MetricRecord, ReadingRecord } from "../reducers/metric"
import { ComponentType, MetricType } from "../types/actions"
import { useTranslation } from "react-i18next"
import Value from "./Value"
// import TinyPreview from "./TinyPreview"

const lookUp: Record<string, string> = {
  d1babde1b9b4b22b1d90f07b2a95180d: "LON",
  "364cb313d02c9120c1d8efe788a36245": "KTW"
}

const getOnFilter = <R extends Record<string, unknown>>(key: keyof R) => {
  return (value: string | number | boolean, record: R) => value === record[key]
}

const getKey = <R,>(obj: R, keys: Array<keyof R>) => keys.map((key) => obj[key]).join("_")
const getSorter = <R extends Record<string, unknown>>(keys: Array<keyof R>) => {
  return (a: R, b: R) => (getKey(a, keys) > getKey(b, keys) ? 1 : -1)
}

const Metrics = (): ReactElement => {
  const { state } = useContext(AppContext)
  const { t } = useTranslation()

  const columns: ColumnsType<MetricRecord> = useMemo(
    () => [
      {
        title: t("tableColumns.deviceId"),
        dataIndex: "deviceId",
        render: function renderDeviceName(deviceId) {
          return lookUp[deviceId]
        },
        filters: [
          { text: "LON", value: "d1babde1b9b4b22b1d90f07b2a95180d" },
          { text: "KTW", value: "364cb313d02c9120c1d8efe788a36245" }
        ],
        onFilter: getOnFilter<MetricRecord>("deviceId"),
        sorter: getSorter<MetricRecord>(["deviceId"])
      },
      {
        title: t("tableColumns.componentType"),
        dataIndex: "componentType",
        render: function renderTag(type: ComponentType) {
          return <Tag color={"blue"}>{t(`componentTypes.${type}` as const)}</Tag>
        },
        filters: [
          { value: ComponentType.CPU, text: t(`componentTypes.${ComponentType.CPU}` as const) },
          { value: ComponentType.DHT22, text: t(`componentTypes.${ComponentType.DHT22}` as const) },
          { value: ComponentType.DS18B20, text: t(`componentTypes.${ComponentType.DS18B20}` as const) },
          { value: ComponentType.BME680, text: t(`componentTypes.${ComponentType.BME680}` as const) }
        ],
        onFilter: getOnFilter<MetricRecord>("componentType"),
        sorter: getSorter<MetricRecord>(["componentType"])
      },
      {
        title: t("tableColumns.componentId"),
        dataIndex: "componentId"
      },
      {
        title: t("tableColumns.metric"),
        dataIndex: "metric",
        render: function renderTag(metric: MetricType) {
          return <Tag color={t(`metricTypeColors.${metric}` as const)}>{t(`metricTypes.${metric}` as const)}</Tag>
        },
        filters: [
          { value: MetricType.Temperature, text: t(`metricTypes.${MetricType.Temperature}` as const) },
          { value: MetricType.Humidity, text: t(`metricTypes.${MetricType.Humidity}` as const) },
          { value: MetricType.Pressure, text: t(`metricTypes.${MetricType.Pressure}` as const) },
          { value: MetricType.Gas, text: t(`metricTypes.${MetricType.Gas}` as const) }
        ],
        onFilter: getOnFilter<MetricRecord>("metric"),
        sorter: getSorter<MetricRecord>(["metric"])
      },
      {
        title: t("tableColumns.value"),
        dataIndex: ["recentValue"],
        render: function renderValue(value: number, metric: MetricRecord) {
          return <Value value={value} metric={metric.metric} />
        },
        sorter: getSorter<MetricRecord>(["metric", "recentValue"])
      },
      {
        title: t("tableColumns.chart"),
        dataIndex: "liveReadings",
        render: function renderValue(readings: Array<ReadingRecord>) {
          return <p>{readings.length}</p>
          // return <TinyPreview readings={readings} />
        }
      }
    ],
    [t]
  )
  return (
    <div className="Metrics">
      <Table<MetricRecord>
        dataSource={state.metric.metrics}
        columns={columns}
        rowKey={"id"}
        pagination={{ position: ["bottomCenter"] }}
      />
    </div>
  )
}

export default Metrics
