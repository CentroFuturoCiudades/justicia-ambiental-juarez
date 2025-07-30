const formatNumber = (value: number | undefined, decimalPlaces: number = 2) => {
  if (value == undefined) return "";
  if (decimalPlaces == 0) {
    value = Math.trunc(value)
  }

  if (value < 0) {
    return `( ${value.toLocaleString("es-MX", { maximumFractionDigits: decimalPlaces, minimumFractionDigits: decimalPlaces })})`
  } else {
    return value.toLocaleString("es-MX", { maximumFractionDigits: decimalPlaces, minimumFractionDigits: decimalPlaces })
  }
}

export { formatNumber };