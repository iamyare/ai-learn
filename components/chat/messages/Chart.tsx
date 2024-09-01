import { Button } from '@/components/ui/button'
import React, { useState, useEffect, useMemo } from 'react'
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
  ResponsiveContainer,
  Cell
} from 'recharts'

interface ChartProps {
  chartData: ChartData
}

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#0088FE', '#00C49F', '#FFBB28', '#FF8042']

const Chart: React.FC<ChartProps> = ({ chartData }) => {
  const [chartType, setChartType] = useState(chartData.type)
  const [adaptedData, setAdaptedData] = useState<ChartData>(chartData)

  const adaptDataToChartType = useMemo(() => (type: 'bar' | 'line' | 'pie' | 'scatter') => {
    let newData: ChartData = JSON.parse(JSON.stringify(chartData));

    if (type === 'pie' && chartData.type !== 'pie') {
      newData.datasets = [{
        label: 'Values',
        data: chartData.datasets[0].data
      }]
    } else if (type === 'scatter' && chartData.type !== 'scatter') {
      newData.datasets = [{
        label: 'Points',
        data: chartData.datasets[0].data.map(value => value)
      }]
    } else if ((type === 'bar' || type === 'line') && (chartData.type === 'pie' || chartData.type === 'scatter')) {
      newData.labels = chartData.labels
      newData.datasets = [{
        label: 'Values',
        data: chartData.datasets[0].data
      }]
    }

    newData.type = type
    return newData
  }, [chartData])

  useEffect(() => {
    setAdaptedData(adaptDataToChartType(chartType))
  }, [chartType, adaptDataToChartType])

  const renderChart = () => {
    const data = adaptedData.datasets[0].data.map((value, index) => ({
      name: adaptedData.labels[index],
      value
    }))

    switch (chartType) {
      case 'bar':
        return (
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="value" fill="#8884d8" />
          </BarChart>
        )
      case 'line':
        return (
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="value" stroke="#8884d8" />
          </LineChart>
        )
      case 'pie':
        return (
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={80}
              label
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        )
      case 'scatter':
        return (
          <ScatterChart>
            <CartesianGrid />
            <XAxis type="number" dataKey="name" name="x" />
            <YAxis type="number" dataKey="value" name="y" />
            <Tooltip cursor={{ strokeDasharray: '3 3' }} />
            <Scatter name="Values" data={data} fill="#8884d8" />
          </ScatterChart>
        )
    }
  }

  return (
    <div className="flex flex-col gap-2 w-full h-[350px] overflow-scroll">
      <h3 className="text-lg font-semibold mb-2">{adaptedData.title}</h3>
      {chartType !== adaptedData.type && (
        <p className="text-yellow-600 mb-2">
          Nota: Los datos se han adaptado para ajustarse a este tipo de gráfico. Algunos datos pueden no representarse con precisión.
        </p>
      )}
      <ResponsiveContainer width="100%" height="100%">
        {renderChart()}
      </ResponsiveContainer>
      <div className="flex items-end  w-full justify-center space-x-2 ">
        <ButtonSmall onClick={() => setChartType('bar')}>Barra</ButtonSmall>
        <ButtonSmall onClick={() => setChartType('line')}>Línea</ButtonSmall>
        <ButtonSmall onClick={() => setChartType('pie')}>Pastel</ButtonSmall>
        <ButtonSmall onClick={() => setChartType('scatter')}>Dispersión</ButtonSmall>
      </div>
    </div>
  )
}

function ButtonSmall({ children, onClick }: { children: React.ReactNode, onClick: () => void }) {
  return (
    <Button
    variant={'outline'}
    size={'sm'}
      onClick={onClick}
      className="text-xs px-2 py-1 size-fit"
    >
      {children}
    </Button>
  )
}

export default Chart