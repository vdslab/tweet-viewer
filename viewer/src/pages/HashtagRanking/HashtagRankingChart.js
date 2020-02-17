import React from 'react'
import { ResponsiveBarCanvas } from '@nivo/bar'

const HashtagsRankingChart = ({ data }) => {
  return (
    <div style={{ height: '800px' }}>
      <ResponsiveBarCanvas
        data={data}
        keys={['count']}
        indexBy='hashtag'
        margin={{ top: 0, right: 80, bottom: 10, left: 100 }}
        padding={0.15}
        layout='horizontal'
        colors={{ scheme: 'nivo' }}
        borderColor={{ from: 'color', modifiers: [['darker', 1.6]] }}
        axisTop={null}
        axisRight={null}
        axisBottom={{
          tickSize: 0,
          tickPadding: -15,
          tickRotation: 0,
          legend: 'taged count',
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
    </div>
  )
}

export default HashtagsRankingChart
