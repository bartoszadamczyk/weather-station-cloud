import React, { ReactElement } from "react"
import { TinyArea } from "@ant-design/charts"
import { RecentValue } from "../../reducers/data"

const TinyPreview = ({ values }: { values: Array<RecentValue> }): ReactElement => {
  let data = values.map((reading) => Math.round(reading.metricValue * 100) / 100)
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
