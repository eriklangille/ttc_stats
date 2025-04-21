import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts'
import type { Incident } from '../utils/read_data'

type StationIncidentChartProps = {
  incidents: Incident[]
  lineColor: string
  topIncidentCount?: number
  leftMargin?: number
}

const CustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, value, name }: any) => {
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
        {`${name} (${value})`}
      </text>
    </g>
  )
}

const getIncidentGroups = (incidents: Incident[], lineColor: string, topIncidentCount: number = 5) => {
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
  const topIncidents = sortedIncidents.slice(0, topIncidentCount)
  const otherCount = sortedIncidents.slice(topIncidentCount).reduce((sum, incident) => sum + incident.value, 0)
  
  if (otherCount > 0) {
    topIncidents.push({ name: 'Other', value: otherCount })
  }

  // Generate shades of the line color with dynamic opacity based on number of incidents
  const baseColor = lineColor
  const colors = topIncidents.map((_, index) => {
    // Adjust opacity range based on number of incidents
    const opacityRange = 0.5 // Maximum opacity difference
    const opacityStep = opacityRange / (topIncidents.length - 1)
    const opacity = 0.4 + (index * opacityStep)
    return `${baseColor}${Math.round(opacity * 255).toString(16).padStart(2, '0')}`
  })

  return {
    data: topIncidents,
    colors
  }
}

export const StationIncidentChart = ({ incidents, lineColor, leftMargin = -15, topIncidentCount = 5 }: StationIncidentChartProps) => {
  const { data, colors } = getIncidentGroups(incidents, lineColor, topIncidentCount)

  return (
    <div className="h-48 mb-4">
      <ResponsiveContainer width="100%" height="100%">
          <PieChart margin={{ top: 5, right: 0, left: leftMargin, bottom: 5 }}>
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