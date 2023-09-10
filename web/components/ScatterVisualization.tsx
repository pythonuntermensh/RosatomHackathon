'use client'

import React from 'react'
import Plot from 'react-plotly.js'
import Box from '@/components/Box'
import Button from '@/components/Button'
import {saveImage} from '@/utils/saveVisualizationFile'

interface DataPoint {
  x: number
  y: number
}

interface Cluster {
  clusterId: number
  clusterName: string
  dataPoints: DataPoint[]
}

interface ClusterVisualizationProps {
  chartData: Cluster[]
}

function ScatterVisualization({chartData}: ClusterVisualizationProps) {
  if (!chartData) {
    return
  }

  const data = chartData.map((cluster) => ({
    x: cluster.dataPoints.map((point) => point.x),
    y: cluster.dataPoints.map((point) => point.y),
    mode: 'markers',
    type: 'scatter',
    name: cluster.clusterName,
  }))

  const plotConfig = {
    displayModeBar: false,
    displaylogo: false,
  }

  return (
    <div className='flex w-full h-full items-center justify-center'>
      <Box id='scatter-chart-div' className='w-full md:w-[75%]'>
        <Plot
          className='w-[98%]'
          data={data}
          layout={{
            title: 'Точечная визуализация',
            xaxis: {title: 'X-ось'},
            yaxis: {title: 'Y-ось'},
          }}
          config={plotConfig}
          divId='scatter-chart-div'
        />

        <Button
          onClick={() => {
            saveImage('scatter-chart-div', 'scatter-chart.svg')
          }}
          className='w-[170px] mb-2'
        >
          Сохранить как .svg
        </Button>
      </Box>
    </div>
  )
}

export default ScatterVisualization;
