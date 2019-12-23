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
      enableGridX
    />
  )
}

export default RetweetedTweetRankingHistogram
