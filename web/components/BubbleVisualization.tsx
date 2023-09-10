'use client'

import React from 'react'
import Box from '@/components/Box'
import Button from '@/components/Button'
import Plot from 'react-plotly.js'
import {saveImage} from '@/utils/saveVisualizationFile'

function BubbleVisualization({chartData}) {
  const data = chartData.map((bubble) => ({
    x: bubble.xValues,
    y: bubble.yValues,
    mode: 'markers',
    marker: {
      size: bubble.markerSizes,
      opacity: 0.6,
    },
    text: bubble.textLabels,
    type: 'scatter',
    name: bubble.chartName,
  }))

  const plotConfig = {
    displayModeBar: false,
    displaylogo: false,
    responsive: true,
  }
  
  return (
    <div className='flex w-full h-full items-center justify-center'>
      <Box id='bubble-chart-div' className='w-full md:w-[75%]'>
        <Plot
          className='w-[98%]'
          data={data}
          layout={{
            title: 'Bubble визуализация',
            xaxis: {title: 'X-ось'},
            yaxis: {title: 'Y-ось'},
          }}
          config={plotConfig}
          divId='bubble-chart-div'
        />

        <Button onClick={() => saveImage('bubble-chart-div', 'bubble-chart.svg')} className='w-[170px] mb-2'>Сохранить как .svg</Button>
      </Box>
    </div>
  )
}

export default BubbleVisualization;