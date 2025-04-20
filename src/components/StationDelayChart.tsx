import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from 'recharts'

type StationDelayChartProps = {
  delayLikelihood: { hour: number; likelihood: number }[]
  lineColor: string
}

const formatHour = (hour: number) => {
  if (hour === 0) return '12A';
  if (hour < 12) return `${hour}A`;
  if (hour === 12) return '12P';
  return `${hour - 12}P`;
}

export const StationDelayChart = ({ delayLikelihood, lineColor }: StationDelayChartProps) => {
  return (
    <div className="h-48 mb-4">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={delayLikelihood} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
          <XAxis 
            dataKey="hour" 
            tick={{ fontSize: 10, fill: 'white' }}
            interval={1}
            tickFormatter={formatHour}
          />
          <YAxis 
            tick={{ fontSize: 10, fill: 'white' }}
            tickFormatter={(value) => `${value}%`}
          />
          <Bar 
            dataKey="likelihood" 
            fill={lineColor}
            radius={[4, 4, 0, 0]}
            isAnimationActive={false}
            style={{ cursor: 'default' }}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
} 