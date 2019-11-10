import React from 'react'
import { ResponsiveBarCanvas } from '@nivo/bar'

const RetweetedTweetRankingHistogram = ({ data }) => {
  return (
    <ResponsiveBarCanvas
      data={data}
      keys={['cnt']}
      indexBy='level'
      margin={{ top: 0, right: 80, bottom: 20, left: 100 }}
      padding={0}
      layout='vertical'
      colors={{ scheme: 'nivo' }}
      borderColor={{ from: 'color', modifiers: [['darker', 1.6]] }}
      axisTop={null}
      axisRight={null}
      axisBottom={{
        tickSize: 0,
        tickPadding: 5,
        tickRotation: 0,
        legend: '',
        legendPosition: 'middle',
        legendOffset: 5
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
    />
  )
}

export default RetweetedTweetRankingHistogram
