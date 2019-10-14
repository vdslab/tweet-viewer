import React from 'react'
import { ResponsiveBarCanvas } from '@nivo/bar'

const TweetTimesHistogram = ({ data }) => {
  return (
    <ResponsiveBarCanvas
      data={data}
      keys={['count']}
      indexBy='month'
      margin={{ top: 20, right: 15, bottom: 70, left: 60 }}
      pixelRatio={2}
      padding={0.5}
      innerPadding={0}
      minValue='auto'
      maxValue='auto'
      groupMode='stacked'
      layout='vertical'
      reverse={false}
      colors={{ scheme: 'red_blue' }}
      colorBy='id'
      borderWidth={0}
      borderColor={{ from: 'color', modifiers: [['darker', 1.6]] }}
      axisRight={null}
      axisBottom={{
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 45,
        legend: 'month',
        legendPosition: 'middle',
        legendOffset: 60
      }}
      axisLeft={{
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
        legend: 'count of tweets',
        legendPosition: 'middle',
        legendOffset: -55
      }}
      enableGridX={!!true}
      enableGridY={false}
      enableLabel={!!true}
      labelSkipWidth={12}
      labelSkipHeight={12}
      labelTextColor={{ from: 'color', modifiers: [['darker', 1.6]] }}
      isInteractive={!!true}
    />
  )
}

export default TweetTimesHistogram
