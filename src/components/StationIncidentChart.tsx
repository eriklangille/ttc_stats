import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts'
import type { Incident } from '../utils/read_data'

const TOP_INCIDENT_COUNT = 5

type StationIncidentChartProps = {
  incidents: Incident[]
  lineColor: string
}

const CustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, name }: any) => {
  const RADIAN = Math.PI / 180
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5
  const x = cx + radius * Math.cos(-midAngle * RADIAN)
  const y = cy + radius * Math.sin(-midAngle * RADIAN)

  // Calculate end points for the label line
  const labelRadius = outerRadius + 5
  const labelX = cx + labelRadius * Math.cos(-midAngle * RADIAN)
  const labelY = cy + labelRadius * Math.sin(-midAngle * RADIAN)

  return (
    <g>
      <text
        x={labelX}
        y={labelY}
        fill="white"
        textAnchor={x > cx ? 'start' : 'end'}
        dominantBaseline="central"
        fontSize={8}
      >
        {`${name} ${(percent * 100).toFixed(0)}%`}
      </text>
    </g>
  )
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

  // Take top N and group the rest as "Other"
  const topIncidents = sortedIncidents.slice(0, TOP_INCIDENT_COUNT)
  const otherCount = sortedIncidents.slice(TOP_INCIDENT_COUNT).reduce((sum, incident) => sum + incident.value, 0)
  
  if (otherCount > 0) {
    topIncidents.push({ name: 'Other', value: otherCount })
  }

  // Generate shades of the line color
  const baseColor = lineColor
  const colors = topIncidents.map((_, index) => {
    const opacity = 0.4 + (index * 0.1) // Vary opacity from 0.2 to 1.0
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
            outerRadius={45}
            fontSize={8}
            fill={lineColor}
            animationDuration={0}
            isAnimationActive={false}
            dataKey="value"
            label={CustomLabel}
            stroke="transparent"
          >
            {data.map((_, index) => (
              <Cell key={`cell-${index}`} fill={colors[index]} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
} 