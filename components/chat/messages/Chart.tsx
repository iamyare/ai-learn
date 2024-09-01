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
    newData.type = type;
    return newData;
  }, [chartData])

  useEffect(() => {
    setAdaptedData(adaptDataToChartType(chartType))
  }, [chartType, adaptDataToChartType])

  const processedData = useMemo(() => {
    return adaptedData.labels.map((label, index) => {
      const dataPoint: { [key: string]: string | number } = { name: label };
      adaptedData.datasets.forEach(dataset => {
        dataPoint[dataset.label] = dataset.data[index];
      });
      return dataPoint;
    });
  }, [adaptedData]);

  const renderChart = () => {
    const commonProps = {
      data: processedData,
      margin: { top: 5, right: 30, left: 20, bottom: 5 },
    };

    const renderYAxis = (dataKey: string) => (
      <YAxis 
        key={dataKey}
        yAxisId={dataKey}
        label={{ value: dataKey, angle: -90, position: 'insideLeft' }}
        orientation={dataKey === adaptedData.datasets[0].label ? 'left' : 'right'}
      />
    );

    switch (chartType) {
      case 'bar':
        return (
          <BarChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            {adaptedData.datasets.map(dataset => renderYAxis(dataset.label))}
            <Tooltip />
            <Legend />
            {adaptedData.datasets.map((dataset, index) => (
              <Bar key={dataset.label} dataKey={dataset.label} fill={COLORS[index % COLORS.length]} yAxisId={dataset.label} />
            ))}
          </BarChart>
        )
      case 'line':
        return (
          <LineChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            {adaptedData.datasets.map(dataset => renderYAxis(dataset.label))}
            <Tooltip />
            <Legend />
            {adaptedData.datasets.map((dataset, index) => (
              <Line key={dataset.label} type="monotone" dataKey={dataset.label} stroke={COLORS[index % COLORS.length]} yAxisId={dataset.label} />
            ))}
          </LineChart>
        )
      case 'pie':
        return (
          <PieChart>
            <Pie
              data={processedData}
              dataKey={adaptedData.datasets[0].label}
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={80}
              label
            >
              {processedData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        )
      case 'scatter':
        return (
          <ScatterChart {...commonProps}>
            <CartesianGrid />
            <XAxis type="number" dataKey={adaptedData.datasets[0].label} name={adaptedData.datasets[0].label} />
            <YAxis type="number" dataKey={adaptedData.datasets[1].label} name={adaptedData.datasets[1].label} />
            <Tooltip cursor={{ strokeDasharray: '3 3' }} />
            <Legend />
            <Scatter name="Datos" data={processedData} fill="#8884d8" />
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