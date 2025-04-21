import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts'

type MonthlyComparisonChartProps = {
  data: {
    month: number;
    avgDelay2019: number;
    incidents2019: number;
    avgDelay2024: number;
    incidents2024: number;
  }[];
}

const formatMonth = (month: number) => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return months[month - 1];
}

export const MonthlyComparisonChart = ({ data }: MonthlyComparisonChartProps) => {
  return (
    <div className="h-48 mb-4">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 5, right: 0, left: -20, bottom: 5 }}>
          <XAxis 
            dataKey="month" 
            tick={{ fontSize: 10, fill: 'white' }}
            interval={0}
            tickFormatter={formatMonth}
          />
          <YAxis 
            tick={{ fontSize: 10, fill: 'white' }}
          />
          <Bar 
            dataKey="incidents2019" 
            fill="rgba(255, 255, 255, 0.5)"
            radius={[4, 4, 0, 0]}
            isAnimationActive={false}
          />
          <Bar 
            dataKey="incidents2024" 
            fill="white"
            radius={[4, 4, 0, 0]}
            isAnimationActive={false}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
} 