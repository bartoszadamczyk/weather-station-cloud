import React, { ReactElement, useContext, useMemo } from "react"
import { AppContext } from "../providers/AppContext"
import { Table, Tag, Tooltip } from "antd"
import { ColumnsType } from "antd/lib/table/interface"
import { MetricRecord, ReadingRecord } from "../reducers/metric"
import { ModuleType, MetricType } from "../types/actions"
import { useTranslation } from "react-i18next"
import Value from "./Value"
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
      Object.keys(state.metric.devices).map((key) => ({
        value: key,
        text: state.metric.devices[key].name || key
      })),
    [state.metric.devices]
  )

  const columns: ColumnsType<MetricRecord> = useMemo(
    () => [
      {
        title: t("tableColumns.deviceId"),
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
        title: t("tableColumns.moduleType"),
        dataIndex: "moduleType",
        render: function renderTag(type: ModuleType) {
          return <Tag color={"blue"}>{t(`moduleTypes.${type}` as const)}</Tag>
        },
        filters: [
          { value: ModuleType.CPU, text: t(`moduleTypes.${ModuleType.CPU}` as const) },
          { value: ModuleType.DHT22, text: t(`moduleTypes.${ModuleType.DHT22}` as const) },
          { value: ModuleType.DS18B20, text: t(`moduleTypes.${ModuleType.DS18B20}` as const) },
          { value: ModuleType.BME680, text: t(`moduleTypes.${ModuleType.BME680}` as const) }
        ],
        onFilter: getOnFilter<MetricRecord>("moduleType"),
        sorter: getSorter<MetricRecord>(["moduleType"])
      },
      {
        title: t("tableColumns.moduleId"),
        dataIndex: "moduleId",
        render: function renderDeviceName(moduleId, { moduleName }) {
          const moduleMapping = t("moduleMappings" as const, { returnObjects: true }) as Record<string, string>
          return moduleName ? (
            <Tooltip placement="right" title={moduleId}>
              {moduleMapping[moduleName] || moduleName}
            </Tooltip>
          ) : (
            moduleMapping[moduleId] || moduleId
          )
        }
      },
      {
        title: t("tableColumns.metric"),
        dataIndex: "metric",
        render: function renderTag(metric: MetricType) {
          const metricTypeColors = t("metricTypeColors" as const, { returnObjects: true }) as Record<string, string>
          return <Tag color={metricTypeColors[metric]}>{t(`metricTypes.${metric}` as const)}</Tag>
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
          return <TinyPreview readings={readings} />
        }
      }
    ],
    [t, deviceFilter]
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
