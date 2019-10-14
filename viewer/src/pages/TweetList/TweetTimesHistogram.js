import React from 'react'
import { ResponsiveBarCanvas } from '@nivo/bar'

const TweetTimesHistogram = ({ data }) => {
  return (
    <ResponsiveBarCanvas
      data={data}
      keys={['count']}
      indexBy='month'
      margin={{ top: 50, right: 0, bottom: 50, left: 60 }}
      pixelRatio={2}
      padding={0.3}
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
      axisTop={{
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
        legend: '',
        legendOffset: 36
      }}
      axisRight={null}
      axisBottom={{
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
        legend: 'month',
        legendPosition: 'middle',
        legendOffset: 36
      }}
      axisLeft={{
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
        legend: 'count of tweets',
        legendPosition: 'middle',
        legendOffset: -40
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
