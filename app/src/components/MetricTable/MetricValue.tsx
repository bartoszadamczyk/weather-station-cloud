import React, { ReactElement } from "react"
import { MetricType } from "../../types/event"
import { Space } from "antd"
import {
  BiArrowFromBottom,
  BiArrowToBottom,
  BsDroplet,
  BsDropletFill,
  BsDropletHalf,
  ImSun,
  IoIosThermometer,
  IoSnow,
  MdBubbleChart
} from "react-icons/all"

const renderMetricValue = (metricType: MetricType, metricValue: number) => {
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
    default:
      return metricValue
  }
}

const MetricValue = ({ metricType, metricValue }: { metricType: MetricType; metricValue: number }): ReactElement => {
  return (
    <div className="MetricValue">
      <Space size="small">{renderMetricValue(metricType, metricValue)}</Space>
    </div>
  )
}

export default MetricValue
