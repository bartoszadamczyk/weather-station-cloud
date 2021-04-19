import React, { ReactElement } from "react"
import { MetricType } from "../types/actions"
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

const renderValue = (metric: MetricType, value: number) => {
  switch (metric) {
    case MetricType.Temperature:
      return (
        <Space size="small">
          {value < 3 ? <IoSnow /> : value > 20 ? <ImSun /> : <IoIosThermometer />}
          {`${value.toFixed(2)}°C`}
        </Space>
      )
    case MetricType.Humidity:
      return (
        <Space size="small">
          {value < 30 ? <BsDroplet /> : value < 60 ? <BsDropletHalf /> : <BsDropletFill />}
          {`${value.toFixed(2)}%`}
        </Space>
      )
    case MetricType.Pressure:
      return (
        <Space size="small">
          {value < 1000 ? <BiArrowToBottom /> : <BiArrowFromBottom />}
          {`${value.toFixed(0)}hPa`}
        </Space>
      )
    case MetricType.Gas:
      return (
        <Space size="small">
          <MdBubbleChart />
          {`${value.toFixed(0)}Ω`}
        </Space>
      )
    default:
      return value
  }
}

const MetricValue = ({ metric, value }: { metric: MetricType; value: number }): ReactElement => {
  return (
    <div className="Value">
      <Space size="small">{renderValue(metric, value)}</Space>
    </div>
  )
}

export default MetricValue
