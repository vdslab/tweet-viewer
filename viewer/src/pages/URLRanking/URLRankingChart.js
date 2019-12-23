import React from 'react'
import { ResponsiveBarCanvas } from '@nivo/bar'

const URLRankingChart = ({ data }) => {
  for (const i in data) {
    if (!data[i].URL) {
      data[i].URL = 'undefined'
    }
  }

  const barSize = 20
  const margin = { top: 0, right: 80, bottom: 50, left: 220 }

  return (
    <div
      style={{
        height: `${barSize * data.length + margin.top + margin.bottom}px`
      }}
    >
      <ResponsiveBarCanvas
        data={data}
        keys={['count']}
        indexBy='URL'
        margin={margin}
        padding={0.15}
        layout='horizontal'
        colors={{ scheme: 'nivo' }}
        borderColor={{ from: 'color', modifiers: [['darker', 1.6]] }}
        axisTop={null}
        axisRight={null}
        axisBottom={{
          tickSize: 0,
          tickPadding: 0,
          tickRotation: 0,
          legend: 'url used',
          legendPosition: 'middle',
          legendOffset: 20
        }}
        axisLeft={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legend: '',
          legendPosition: 'middle',
          legendOffset: -40
        }}
        enableGridX={!!1}
        legends={[
          {
            dataFrom: 'keys',
            anchor: 'bottom-right',
            direction: 'column',
            justify: false,
            translateX: 120,
            translateY: 0,
            itemsSpacing: 2,
            itemWidth: 100,
            itemHeight: 20,
            itemDirection: 'left-to-right',
            itemOpacity: 0.85,
            symbolSize: 20,
            effects: [
              {
                on: 'hover',
                style: {
                  itemOpacity: 1
                }
              }
            ]
          }
        ]}
        label={(d) => {
          console.log(d)
          return d.URL.substring(0, 5)
        }}
      />
    </div>
  )
}

export default URLRankingChart
