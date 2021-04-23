import { useContext, useMemo } from "react"
import { useTranslation } from "react-i18next"
import { MetricType, ModuleType } from "../../types/event"
import { AppContext } from "../../providers/AppContext"
import { groupBy } from "../../helpers"

export const useModuleTypeFilter = (): Array<{ value: string; text: string }> => {
  const { t } = useTranslation()
  return useMemo(
    () => [
      { value: ModuleType.RPI, text: t(`moduleType.${ModuleType.RPI}` as const) },
      { value: ModuleType.DHT22, text: t(`moduleType.${ModuleType.DHT22}` as const) },
      { value: ModuleType.DS18B20, text: t(`moduleType.${ModuleType.DS18B20}` as const) },
      { value: ModuleType.BME680, text: t(`moduleType.${ModuleType.BME680}` as const) },
      { value: ModuleType.Relay, text: t(`moduleType.${ModuleType.Relay}` as const) }
    ],
    [t]
  )
}

export const useMetricTypeFilter = (): Array<{ value: string; text: string }> => {
  const { t } = useTranslation()
  return useMemo(
    () => [
      { value: MetricType.Temperature, text: t(`metricType.${MetricType.Temperature}` as const) },
      { value: MetricType.Humidity, text: t(`metricType.${MetricType.Humidity}` as const) },
      { value: MetricType.Pressure, text: t(`metricType.${MetricType.Pressure}` as const) },
      { value: MetricType.Vox, text: t(`metricType.${MetricType.Vox}` as const) },
      { value: MetricType.State, text: t(`metricType.${MetricType.State}` as const) }
    ],
    [t]
  )
}

export const useDeviceIdFilter = (): Array<{ value: string; text: string }> => {
  const { state } = useContext(AppContext)
  return useMemo(() => {
    const devices = groupBy(state.data.metrics, "deviceId")
    return Object.keys(devices).map((deviceId) => ({
      value: deviceId,
      text: devices[deviceId][0].deviceName || deviceId
    }))
  }, [state.data.metrics])
}
