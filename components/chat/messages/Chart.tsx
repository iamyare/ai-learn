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
  Cell,
  LabelList,
  Sector,
  AreaChart,
  Area
} from 'recharts'
import {
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent
} from '@/components/ui/chart'
import { Button } from '@/components/ui/button'
import { PieSectorDataItem } from 'recharts/types/polar/Pie'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'

interface ChartProps {
  chartData: ChartData
}

const COLORS = [
  'hsl(var(--chart-1))',
  'hsl(var(--chart-2))',
  'hsl(var(--chart-3))',
  'hsl(var(--chart-4))'
]

const Chart: React.FC<ChartProps> = ({ chartData }) => {
  const [chartType, setChartType] = useState(chartData.type)
  const [adaptedData, setAdaptedData] = useState<ChartData>(chartData)
  const [activeDataset, setActiveDataset] = useState(0)
  const [error, setError] = useState<string | null>(null)

  const adaptDataToChartType = useMemo(
    () => (type: 'bar' | 'line' | 'pie' | 'scatter' | 'area') => {
      let newData: ChartData = JSON.parse(JSON.stringify(chartData))
      newData.type = type
      return newData
    },
    [chartData]
  )

  useEffect(() => {
    setAdaptedData(adaptDataToChartType(chartType))
    setError(null) // Reset error when chart type changes
  }, [chartType, adaptDataToChartType])

  const processedData = useMemo(() => {
    try {
      return adaptedData.labels.map((label, index) => {
        const dataPoint: { [key: string]: string | number } = { name: label }
        adaptedData.datasets.forEach((dataset) => {
          dataPoint[dataset.label] = dataset.data[index]
        })
        return dataPoint
      })
    } catch (err) {
      console.error('Error processing chart data:', err)
      setError('Error al procesar los datos del gráfico.')
      return []
    }
  }, [adaptedData])

  const chartConfig: ChartConfig = useMemo(() => {
    try {
      return adaptedData.datasets.reduce(
        (acc, dataset, index) => {
          acc[dataset.label] = {
            label: dataset.label,
            color: COLORS[index % COLORS.length]
          }
          return acc
        },
        {} as ChartConfig
      )
    } catch (err) {
      console.error('Error creating chart config:', err)
      setError('Error al configurar el gráfico.')
      return {}
    }
  }, [adaptedData])

  const renderChart = (): React.ReactElement | null => {
    try {
      const commonProps = {
        data: processedData,
        width: 273,
        height: 350,
        margin: { top: 20, right: 30, left: 20, bottom: 5 }
      }

      switch (chartType) {
        case 'bar':
          return (
            <BarChart accessibilityLayer {...commonProps}>
              <ChartTooltip content={<ChartTooltipContent />} />
              <CartesianGrid vertical={false} />
              <Bar
                dataKey={adaptedData.datasets[activeDataset].label}
                fill={`var(--color-${adaptedData.datasets[activeDataset].label})`}
                radius={8}
              >
                <LabelList position='top' offset={12} fontSize={12} />
              </Bar>
              <XAxis dataKey={'label'} />

            </BarChart>
          )
        case 'line':
          return (
            <LineChart {...commonProps}>
              <CartesianGrid strokeDasharray='3 3' />
              <XAxis dataKey={'label'} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Line
                dataKey={adaptedData.datasets[activeDataset].label}
                type='monotone'
                strokeWidth={2}
                stroke={`var(--color-${adaptedData.datasets[activeDataset].label})`}
                dot={{
                  fill: `var(--color-${adaptedData.datasets[activeDataset].label})`
                }}
                activeDot={{
                  r: 6
                }}
              />
            </LineChart>
          )
        case 'pie':
          return (
            <PieChart width={273} height={350}>
              <Pie
                data={processedData}
                dataKey={adaptedData.datasets[activeDataset].label}
                nameKey='name'
                innerRadius={60}
                strokeWidth={5}
                activeIndex={0}
                activeShape={({
                  outerRadius = 0,
                  ...props
                }: PieSectorDataItem) => (
                  <Sector {...props} outerRadius={outerRadius + 10} />
                )}
                label
              >
                {processedData.map((_, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
              />
            </PieChart>
          )
        case 'area':
          return (
            <AreaChart {...commonProps}>
              <defs>
                {adaptedData.datasets.map((dataset, index) => (
                  <linearGradient key={dataset.label} id={`fill${dataset.label}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={COLORS[index % COLORS.length]} stopOpacity={0.8}/>
                    <stop offset="95%" stopColor={COLORS[index % COLORS.length]} stopOpacity={0.1}/>
                  </linearGradient>
                ))}
              </defs>
              <ChartTooltip content={<ChartTooltipContent />} />
              <CartesianGrid vertical={false} />
              <XAxis dataKey={'label'} />
              {adaptedData.datasets.map((dataset, index) => (
                <Area
                  key={dataset.label}
                  type="monotone"
                  dataKey={dataset.label}
                  stroke={COLORS[index % COLORS.length]}
                  fillOpacity={0.4}
                  fill={`url(#fill${dataset.label})`}
                />
              ))}
            </AreaChart>
          )
        case 'scatter':
          if (adaptedData.datasets.length < 2) {
            throw new Error('El gráfico de dispersión requiere al menos dos conjuntos de datos.')
          }
          return (
            <ScatterChart {...commonProps}>
              <CartesianGrid />
              <XAxis
                type='number'
                dataKey={adaptedData.datasets[0].label}
                name={adaptedData.datasets[0].label}
              />
              <YAxis
                type='number'
                dataKey={adaptedData.datasets[1].label}
                name={adaptedData.datasets[1].label}
              />
              <ChartTooltip
                cursor={{ strokeDasharray: '3 3' }}
                content={<ChartTooltipContent />}
              />
              <Scatter name='Datos' data={processedData} fill={COLORS[0]} />
            </ScatterChart>
          )
        default:
          throw new Error('Tipo de gráfico no soportado.')
      }
    } catch (err) {
      console.error('Error rendering chart:', err)
      if (err instanceof Error) {
        setError(`Error al renderizar el gráfico: ${err.message}`)
      } else {
        setError('Error al renderizar el gráfico.')
      }
      return null
    }
  }

  return (
    <>
      <CardHeader className='flex flex-col items-stretch space-y-0 border-b p-0'>
        <div className='flex flex-1 flex-col justify-center gap-1 p-2'>
          <CardTitle>{adaptedData.title}</CardTitle>
          <CardDescription>
            {chartType !== adaptedData.type
              ? 'Nota: Los datos se han adaptado para ajustarse a este tipo de gráfico.'
              : 'Mostrando datos para el período seleccionado'}
          </CardDescription>
        </div>
        <div className='flex'>
          {adaptedData.datasets.map((dataset, index) => (
            <button
              key={dataset.label}
              data-active={activeDataset === index}
              className='relative flex flex-1 flex-col justify-center gap-1  px-4 py-2 text-left  data-[active=true]:bg-muted/50  '
              onClick={() => setActiveDataset(index)}
            >
              <span className='text-xs text-muted-foreground'>
                {dataset.label}
              </span>
              <span className=' text-lg font-bold leading-none '>
                {dataset.data.reduce((a, b) => a + b, 0).toLocaleString()}
              </span>
            </button>
          ))}
        </div>
      </CardHeader>
      <CardContent className='px-2 sm:p-6'>
        {error ? (
          <Alert variant="destructive">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        ) : (
          <ChartContainer
            config={chartConfig}
            className='aspect-auto h-[350px] w-full'
          >
            {renderChart() as React.ReactElement}
          </ChartContainer>
        )}
        <ScrollArea className=' w-full'>
          <div className='flex items-center justify-center space-x-2 mt-4'>
            <Button
              variant='outline'
              size='sm'
              onClick={() => setChartType('bar')}
            >
              Barra
            </Button>
            <Button
              variant='outline'
              size='sm'
              onClick={() => setChartType('line')}
            >
              Línea
            </Button>
            <Button
              variant='outline'
              size='sm'
              onClick={() => setChartType('pie')}
            >
              Pastel
            </Button>
            <Button
              variant='outline'
              size='sm'
              onClick={() => setChartType('area')}
            >
              Área
            </Button>
            <Button
              variant='outline'
              size='sm'
              onClick={() => setChartType('scatter')}
            >
              Dispersión
            </Button>
          </div>
          <ScrollBar orientation='horizontal' />
        </ScrollArea>
      </CardContent>
    </>
  )
}

export default Chart