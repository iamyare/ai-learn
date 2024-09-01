import React from 'react'
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts'

interface ChartProps {
  chartData: ChartData
}

const Chart: React.FC<ChartProps> = ({ chartData }) => {
  console.log('Received chartData:', chartData)
  const { type, title, labels, datasets, xAxisLabel, yAxisLabel } = chartData

  const ChartComponent = {
    bar: BarChart,
    line: LineChart,
    pie: PieChart,
    scatter: ScatterChart
  }[type]

  const DataComponent = {
    bar: Bar,
    line: Line,
    pie: Pie,
    scatter: Scatter
  }[type]

  return (
    
    <div className='w-full h-full '>
      <h3 className='text-lg font-semibold mb-2'>{title}</h3>
      <ResponsiveContainer width='100%' height='100%'>
        <ChartComponent
          data={datasets[0].data.map((value, index) => ({
            name: labels[index],
            value
          }))}
        >
          <CartesianGrid strokeDasharray='3 3' />
          <XAxis
            dataKey='name'
            label={{
              value: xAxisLabel,
              position: 'insideBottom',
              offset: -5
            }}
          />
          <YAxis
            label={{ value: yAxisLabel, angle: -90, position: 'insideLeft' }}
          />
          <Tooltip />
          <Legend />
          {React.createElement(
            DataComponent as
              | React.ComponentClass<any, any>
              | React.FunctionComponent<any>,
            { dataKey: 'value', fill: '#8884d8' }
          )}
        </ChartComponent>
      </ResponsiveContainer>
    </div>
  )
}

export default Chart