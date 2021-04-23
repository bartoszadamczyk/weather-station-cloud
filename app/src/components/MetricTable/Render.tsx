import React, { ReactElement, useCallback } from "react"
import { useTranslation } from "react-i18next"
import { Space, Tag, Tooltip } from "antd"
import { MetricType, ModuleType } from "../../types/event"
import { Metric, RecentValue } from "../../reducers/data"
import TinyPreview from "./TinyPreview"
import {
  BiArrowFromBottom,
  BiArrowToBottom,
  BsDroplet,
  BsDropletFill,
  BsDropletHalf,
  ImSun,
  IoIosThermometer,
  IoPower,
  IoSnow,
  MdBubbleChart
} from "react-icons/all"

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
      const moduleIdMapping = t("moduleIdMapping", { returnObjects: true }) as Record<string, string>
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
      const metricTypeColors = t("metricTypeColor", { returnObjects: true }) as Record<string, string>
      return <Tag color={metricTypeColors[metricType]}>{t(`metricType.${metricType}` as const)}</Tag>
    },
    [t]
  )
}

export const useRenderMetricValue = (): ((metricValue: number, { metricType }: Metric) => ReactElement) => {
  const { t } = useTranslation()

  return useCallback(
    function renderMetricValue(metricValue: number, { metricType }: Metric) {
      switch (metricType) {
        case MetricType.Temperature:
          return (
            <Space size="small">
              {metricValue < 3 ? <IoSnow /> : metricValue > 20 ? <ImSun /> : <IoIosThermometer />}
              {`${metricValue.toFixed(2)}°C`}
            </Space>
          )
        case MetricType.Humidity:
          return (
            <Space size="small">
              {metricValue < 30 ? <BsDroplet /> : metricValue < 60 ? <BsDropletHalf /> : <BsDropletFill />}
              {`${metricValue.toFixed(2)}%`}
            </Space>
          )
        case MetricType.Pressure:
          return (
            <Space size="small">
              {metricValue < 1000 ? <BiArrowToBottom /> : <BiArrowFromBottom />}
              {`${metricValue.toFixed(0)}hPa`}
            </Space>
          )
        case MetricType.Vox:
          return (
            <Space size="small">
              <MdBubbleChart />
              {`${metricValue.toFixed(0)}Ω`}
            </Space>
          )
        case MetricType.State:
          return (
            <Space size="small">
              <IoPower />
              {metricValue > 0 ? t("metricValue.stateOn") : t("metricValue.stateOff")}
            </Space>
          )
        default:
          return <Space size="small">metricValue</Space>
      }
    },
    [t]
  )
}

export function renderChart(recentValues: Array<RecentValue>): ReactElement {
  return <TinyPreview values={recentValues} />
}
