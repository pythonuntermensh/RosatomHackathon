export const saveImage = (divId, fileName) => {
  const chartElement = document.getElementById(divId)
  if (chartElement) {
    const svgData = chartElement.querySelector('svg')?.outerHTML
    if (svgData) {
      const blob = new Blob([svgData], {type: 'image/svg+xml'})
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = fileName
      a.click()
      URL.revokeObjectURL(url)
    }
  }
}
