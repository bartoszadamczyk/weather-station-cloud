import React, { ReactElement, useContext, useMemo } from "react"
import { Table } from "antd"
import { ColumnsType } from "antd/lib/table/interface"
import { useTranslation } from "react-i18next"
import { AppContext } from "../../providers/AppContext"
import { Metric } from "../../reducers/data"
import { getKey } from "../../helpers/misc"
import {
  renderChart,
  renderDeviceName,
  renderMetricValue,
  useRenderMetricType,
  useRenderModuleId,
  useRenderModuleType
} from "./Render"

import { useMetricTypeFilter, useModuleTypeFilter, useDeviceIdFilter } from "./Filters"

const getOnFilter = <R extends Record<string, unknown>>(key: keyof R) => {
  return (value: string | number | boolean, record: R) => value === record[key]
}

const getSorter = <R extends Record<string, unknown>>(keys: Array<keyof R>) => {
  return (a: R, b: R) => {
    const [aKey, bKey] = [getKey(a, keys), getKey(b, keys)]
    return aKey > bKey ? 1 : bKey > aKey ? -1 : 0
  }
}

const useColumns = (): ColumnsType<Metric> => {
  const { t } = useTranslation("translation")
  const renderModuleType = useRenderModuleType()
  const renderModuleId = useRenderModuleId()
  const renderMetricType = useRenderMetricType()
  const moduleTypeFilter = useModuleTypeFilter()
  const metricTypeFilter = useMetricTypeFilter()
  const deviceIdFilter = useDeviceIdFilter()

  return useMemo(
    () => [
      {
        title: t("tableColumn.deviceId"),
        dataIndex: "deviceId",
        render: renderDeviceName,
        filters: deviceIdFilter,
        onFilter: getOnFilter<Metric>("deviceId"),
        sorter: getSorter<Metric>(["deviceId"])
      },
      {
        title: t("tableColumn.moduleType"),
        dataIndex: "moduleType",
        render: renderModuleType,
        filters: moduleTypeFilter,
        onFilter: getOnFilter<Metric>("moduleType"),
        sorter: getSorter<Metric>(["moduleType"])
      },
      {
        title: t("tableColumn.moduleId"),
        dataIndex: "moduleId",
        render: renderModuleId
      },
      {
        title: t("tableColumn.metricType"),
        dataIndex: "metricType",
        render: renderMetricType,
        filters: metricTypeFilter,
        onFilter: getOnFilter<Metric>("metricType"),
        sorter: getSorter<Metric>(["metricType"])
      },
      {
        title: t("tableColumn.metricValue"),
        dataIndex: ["metricValue"],
        render: renderMetricValue,
        sorter: getSorter<Metric>(["metricType", "metricValue"])
      },
      {
        title: t("tableColumn.chart"),
        dataIndex: "recentValues",
        width: 240,
        render: renderChart
      }
    ],
    [t, deviceIdFilter, renderModuleType, moduleTypeFilter, renderModuleId, renderMetricType, metricTypeFilter]
  )
}

const MetricTable = (): ReactElement => {
  const { state } = useContext(AppContext)
  const columns = useColumns()
  return (
    <div className="MetricsTable">
      <Table<Metric> dataSource={state.data.metrics} columns={columns} rowKey={"id"} pagination={false} />
    </div>
  )
}

export default MetricTable