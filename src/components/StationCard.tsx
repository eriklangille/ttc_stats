import type { Station } from './map'
import { Card, CardContent } from "@/components/ui/card"
import { getTopIncidentsForStation, getStationDelayLikelihood, getStationRanks } from '../utils/incidents'
import topIncidents from '../all_stations_top_incidents_by_year.json'
import stationDelayData from '../station_delay_likelihood_by_hour.json'
import stationRankData from '../station_ranking.json'
import { TriangleAlert, Users } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from 'recharts'

type StationCardProps = {
  station: Station
  lineColor: string
  onTouchStart?: (e: React.TouchEvent) => void
  onTouchMove?: (e: React.TouchEvent) => void
  onTouchEnd?: () => void
  onMouseDown?: (e: React.MouseEvent) => void
}

const formatHour = (hour: number) => {
  if (hour === 0) return '12A';
  if (hour < 12) return `${hour}A`;
  if (hour === 12) return '12P';
  return `${hour - 12}P`;
}

export const StationCard = ({ 
  station, 
  lineColor,
  onTouchStart,
  onTouchMove,
  onTouchEnd,
  onMouseDown
}: StationCardProps) => {
  if (!station) return null;
  const incidents = getTopIncidentsForStation(station, topIncidents);
  const delayLikelihood = getStationDelayLikelihood(station, stationDelayData);
  const { dangerRank, usageRank } = getStationRanks(station, stationRankData);

  return (
    <Card className="w-full h-full shadow-none border-1 bg-white/60 backdrop-blur-sm flex flex-col" style={{ borderColor: lineColor }}>
      <div 
        className="w-full h-10 flex justify-center items-center touch-none cursor-move"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        onMouseDown={onMouseDown}
      >
        <div className="w-12 h-1.5 bg-gray-300 rounded-full" />
      </div>
      <CardContent className="px-4 flex-1 overflow-y-auto max-h-[calc(80vh-3rem)]">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-lg font-semibold">{station.name}</h3>
          <div className="flex gap-2 text-sm">
            <span className="px-2 py-1 rounded flex items-center gap-1" style={{ backgroundColor: `${lineColor}20` }}>
              <TriangleAlert size={16} />
              {dangerRank}/74
            </span>
            <span className="px-2 py-1 rounded flex items-center gap-1" style={{ backgroundColor: `${lineColor}20` }}>
              <Users size={16} />
              {usageRank}/74
            </span>
          </div>
        </div>
        
        <div className="mt-4">
          <h4 className="text-sm font-medium mb-2">Delay Likelihood by Hour</h4>
          <div className="h-48 mb-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={delayLikelihood} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
                <XAxis 
                  dataKey="hour" 
                  tick={{ fontSize: 10 }}
                  interval={1}
                  tickFormatter={formatHour}
                />
                <YAxis 
                  tick={{ fontSize: 10 }}
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
        </div>

        <div className="mt-4">
          <h4 className="text-sm font-medium mb-2">Top 10 Incidents</h4>
          {incidents.length > 0 ? (
            <div className="space-y-2">
              {incidents.map((incident, index) => (
                <div key={index} style={{ borderColor: lineColor }} className="text-sm border-b pb-2">
                  <div className="flex justify-between">
                    <span className="font-medium">{incident.description}</span>
                    <span className="text-gray-500">{incident.minDelay} min</span>
                  </div>
                  <div className="text-xs text-gray-500">
                    {incident.date} at {incident.time}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500">No incident data available</p>
          )}
        </div>
      </CardContent>
    </Card>
  )
} 