import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts'
import type { Incident } from '../utils/read_data'

type StationYearlyDelayChartProps = {
  incidents: Incident[]
  lineColor: string
}

const getYearlyAverageDelays = (incidents: Incident[]) => {
  // Group incidents by year and calculate average delay
  const yearlyData = incidents.reduce((acc, incident) => {
    if (!acc[incident.year]) {
      acc[incident.year] = { totalDelay: 0, count: 0 }
    }
    acc[incident.year].totalDelay += incident.minDelay
    acc[incident.year].count += 1
    return acc
  }, {} as Record<number, { totalDelay: number; count: number }>)

  // Convert to array and calculate averages
  return Object.entries(yearlyData)
    .map(([year, data]) => ({
      year: parseInt(year),
      averageDelay: data.totalDelay / data.count
    }))
    .sort((a, b) => a.year - b.year)
}

export const StationYearlyDelayChart = ({ incidents, lineColor }: StationYearlyDelayChartProps) => {
  const data = getYearlyAverageDelays(incidents)

  return (
    <div className="h-48 mb-4">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
          <XAxis 
            dataKey="year" 
            tick={{ fontSize: 10, fill: 'white', textAnchor: 'end' }}
            interval={0}
          />
          <YAxis 
            tick={{ fontSize: 10, fill: 'white' }}
            tickFormatter={(value) => `${value} min`}
          />
          <Line
            type="monotone"
            dataKey="averageDelay"
            stroke={lineColor}
            strokeWidth={2}
            dot={{ fill: lineColor, strokeWidth: 2 }}
            activeDot={{ r: 4, fill: lineColor }}
            isAnimationActive={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
} 