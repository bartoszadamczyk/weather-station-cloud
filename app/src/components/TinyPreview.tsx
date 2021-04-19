import React, { ReactElement } from "react"
import { TinyArea } from "@ant-design/charts"
import { ReadingRecord } from "../reducers/data"

const TinyPreview = ({ readings }: { readings: Array<ReadingRecord> }): ReactElement => {
  let data = readings.map((reading) => Math.round(reading.metric_value * 100) / 100)
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
  return (
    <div className="TinyPreview">
      <TinyArea {...config} />
    </div>
  )
}

export default TinyPreview
