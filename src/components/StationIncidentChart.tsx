import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts'
import type { Incident } from '../utils/read_data'

type StationIncidentChartProps = {
  incidents: Incident[]
  lineColor: string
}

const getIncidentGroups = (incidents: Incident[], lineColor: string) => {
  // Count occurrences of each incident type
  const incidentCounts = incidents.reduce((acc, incident) => {
    const key = incident.description || 'Other'
    acc[key] = (acc[key] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  // Convert to array and sort by count
  const sortedIncidents = Object.entries(incidentCounts)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)

  // Take top 4 and group the rest as "Other"
  const topIncidents = sortedIncidents.slice(0, 4)
  const otherCount = sortedIncidents.slice(4).reduce((sum, incident) => sum + incident.value, 0)
  
  if (otherCount > 0) {
    topIncidents.push({ name: 'Other', value: otherCount })
  }

  // Generate shades of the line color
  const baseColor = lineColor
  const colors = topIncidents.map((_, index) => {
    const opacity = 0.2 + (index * 0.2) // Vary opacity from 0.2 to 1.0
    return `${baseColor}${Math.round(opacity * 255).toString(16).padStart(2, '0')}`
  })

  return {
    data: topIncidents,
    colors
  }
}

export const StationIncidentChart = ({ incidents, lineColor }: StationIncidentChartProps) => {
  const { data, colors } = getIncidentGroups(incidents, lineColor)

  return (
    <div className="h-48 mb-4">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
          >
            {data.map((_, index) => (
              <Cell key={`cell-${index}`} fill={colors[index]} />
            ))}
          </Pie>
          <Tooltip 
            formatter={(value: number) => [`${value} incidents`, 'Count']}
            contentStyle={{ 
              backgroundColor: 'rgba(0, 0, 0, 0.8)',
              border: 'none',
              borderRadius: '4px',
              color: 'white'
            }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
} 