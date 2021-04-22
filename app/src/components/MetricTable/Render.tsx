import React, { ReactElement, useCallback } from "react"
import { useTranslation } from "react-i18next"
import { Tag, Tooltip } from "antd"
import { MetricType, ModuleType } from "../../types/event"
import { Metric, RecentValue } from "../../reducers/data"
import MetricValue from "./MetricValue"
import TinyPreview from "./TinyPreview"

export function renderDeviceName(deviceId: string, { deviceName }: Metric): ReactElement {
  return (
    <Tooltip placement="right" title={deviceId}>
      {deviceName || deviceId}
    </Tooltip>
  )
}

export const useRenderModuleType = (): ((type: ModuleType) => ReactElement) => {
  const { t } = useTranslation()
  return useCallback(
    function renderModuleType(type: ModuleType) {
      return <Tag color={"blue"}>{t(`moduleType.${type}` as const)}</Tag>
    },
    [t]
  )
}

export const useRenderModuleId = (): ((moduleId: string, metric: Metric) => ReactElement) => {
  const { t } = useTranslation()
  return useCallback(
    function renderModuleId(moduleId: string, { moduleName }: Metric) {
      const moduleIdMapping = t("moduleIdMapping" as const, { returnObjects: true }) as Record<string, string>
      return (
        <Tooltip placement="right" title={moduleId}>
          {moduleName ? moduleIdMapping[moduleName] || moduleName : moduleIdMapping[moduleId] || moduleId}
        </Tooltip>
      )
    },
    [t]
  )
}

export const useRenderMetricType = (): ((metricType: MetricType) => ReactElement) => {
  const { t } = useTranslation()
  return useCallback(
    function renderMetricType(metricType: MetricType) {
      const metricTypeColors = t("metricTypeColor" as const, { returnObjects: true }) as Record<string, string>
      return <Tag color={metricTypeColors[metricType]}>{t(`metricType.${metricType}` as const)}</Tag>
    },
    [t]
  )
}

export function renderMetricValue(metricValue: number, { metricType }: Metric): ReactElement {
  return <MetricValue metricValue={metricValue} metricType={metricType} />
}

export function renderChart(recentValues: Array<RecentValue>): ReactElement {
  return <TinyPreview values={recentValues} />
}
