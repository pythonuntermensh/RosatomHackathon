'use client'

import React from 'react'
import Box from "@/components/Box";
import Plot from 'react-plotly.js'
import {saveImage} from "@/utils/saveVisualizationFile";
import Button from "@/components/Button";

function HistogramVisualization({chartData}) {

  if (!chartData || Object.keys(chartData).length === 0) {
    return null;
  }

  const clusterNames = Object.keys(chartData)
  const clusterValues = Object.values(chartData)

  const data = [
    {
      y: clusterValues,
      type: 'bar',
      marker: {
        color: 'blue', // Цвет колонок
      },
      hovertext: clusterNames, // Показать значение x и текстовую подпись при наведении
    },
  ]

  const plotConfig = {
    displayModeBar: false,
    displaylogo: false,
  }

  return (
    <div className='flex w-full h-full items-center justify-center'>
      <Box id='histogram-chart-div' className='w-full md:w-[75%]'>
        <Plot
          className='w-[98%]'
          data={data}
          layout={{
            title: 'Гистограмма кластеров',
            xaxis: {title: 'Кластеры'},
            yaxis: {title: 'Значения'},
          }}
          config={plotConfig}
          divId='histogram-chart-div'
        />
        <Button
          onClick={() => {
            saveImage('histogram-chart-div', 'histogram-chart.svg')
          }}
          className='w-[170px] mb-2'
        >
          Сохранить как .svg
        </Button>
      </Box>
    </div>
  )
}

export default HistogramVisualization
