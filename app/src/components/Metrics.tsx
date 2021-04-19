import React, { ReactElement, useContext, useMemo } from "react"
import { AppContext } from "../providers/AppContext"
import { Table, Tag, Tooltip } from "antd"
import { ColumnsType } from "antd/lib/table/interface"
import { MetricRecord, ReadingRecord } from "../reducers/data"
import { ModuleType, MetricType } from "../types/actions"
import { useTranslation } from "react-i18next"
import MetricValue from "./MetricValue"
import TinyPreview from "./TinyPreview"

const getOnFilter = <R extends Record<string, unknown>>(key: keyof R) => {
  return (value: string | number | boolean, record: R) => value === record[key]
}

const getKey = <R,>(obj: R, keys: Array<keyof R>) => keys.map((key) => obj[key]).join("_")
const getSorter = <R extends Record<string, unknown>>(keys: Array<keyof R>) => {
  return (a: R, b: R) => (getKey(a, keys) > getKey(b, keys) ? 1 : -1)
}

const Metrics = (): ReactElement => {
  const { state } = useContext(AppContext)
  const { t } = useTranslation("translation")

  const deviceFilter = useMemo(
    () =>
      Object.keys(state.data.devices).map((key) => ({
        value: key,
        text: state.data.devices[key].name || key
      })),
    [state.data.devices]
  )

  const columns: ColumnsType<MetricRecord> = useMemo(
    () => [
      {
        title: t("tableColumn.deviceId"),
        dataIndex: "deviceId",
        render: function renderDeviceName(deviceId, { deviceName }) {
          return deviceName ? (
            <Tooltip placement="right" title={deviceId}>
              {deviceName}
            </Tooltip>
          ) : (
            deviceId
          )
        },
        filters: deviceFilter,
        onFilter: getOnFilter<MetricRecord>("deviceId"),
        sorter: getSorter<MetricRecord>(["deviceId"])
      },
      {
        title: t("tableColumn.moduleType"),
        dataIndex: "moduleType",
        render: function renderTag(type: ModuleType) {
          return <Tag color={"blue"}>{t(`moduleType.${type}` as const)}</Tag>
        },
        filters: [
          { value: ModuleType.CPU, text: t(`moduleType.${ModuleType.CPU}` as const) },
          { value: ModuleType.DHT22, text: t(`moduleType.${ModuleType.DHT22}` as const) },
          { value: ModuleType.DS18B20, text: t(`moduleType.${ModuleType.DS18B20}` as const) },
          { value: ModuleType.BME680, text: t(`moduleType.${ModuleType.BME680}` as const) }
        ],
        onFilter: getOnFilter<MetricRecord>("moduleType"),
        sorter: getSorter<MetricRecord>(["moduleType"])
      },
      {
        title: t("tableColumn.moduleId"),
        dataIndex: "moduleId",
        render: function renderDeviceName(moduleId, { moduleName }) {
          const moduleIdMapping = t("moduleIdMapping" as const, { returnObjects: true }) as Record<string, string>
          return moduleName ? (
            <Tooltip placement="right" title={moduleId}>
              {moduleIdMapping[moduleName] || moduleName}
            </Tooltip>
          ) : (
            moduleIdMapping[moduleId] || moduleId
          )
        }
      },
      {
        title: t("tableColumn.metricType"),
        dataIndex: "metricType",
        render: function renderTag(metric: MetricType) {
          const metricTypeColors = t("metricTypeColor" as const, { returnObjects: true }) as Record<string, string>
          return <Tag color={metricTypeColors[metric]}>{t(`metricType.${metric}` as const)}</Tag>
        },
        filters: [
          { value: MetricType.Temperature, text: t(`metricType.${MetricType.Temperature}` as const) },
          { value: MetricType.Humidity, text: t(`metricType.${MetricType.Humidity}` as const) },
          { value: MetricType.Pressure, text: t(`metricType.${MetricType.Pressure}` as const) },
          { value: MetricType.Gas, text: t(`metricType.${MetricType.Gas}` as const) }
        ],
        onFilter: getOnFilter<MetricRecord>("metricType"),
        sorter: getSorter<MetricRecord>(["metricType"])
      },
      {
        title: t("tableColumn.metricValue"),
        dataIndex: ["recentValue"],
        render: function renderValue(value: number, metric: MetricRecord) {
          return <MetricValue value={value} metric={metric.metricType} />
        },
        sorter: getSorter<MetricRecord>(["metricType", "recentValue"])
      },
      {
        title: t("tableColumn.chart"),
        dataIndex: "liveReadings",
        render: function renderValue(readings: Array<ReadingRecord>) {
          return <TinyPreview readings={readings} />
        }
      }
    ],
    [t, deviceFilter]
  )
  return (
    <div className="Metrics">
      <Table<MetricRecord>
        dataSource={state.data.live}
        columns={columns}
        rowKey={"id"}
        pagination={{ position: ["bottomCenter"] }}
      />
    </div>
  )
}

export default Metrics
