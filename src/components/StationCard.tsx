import type { Station } from './map'
import { Card, CardContent } from "@/components/ui/card"
import { getTopIncidentsForStation, getStationDelayLikelihood, getStationRanks } from '../utils/read_data'
import topIncidents from '../all_stations_top_incidents_by_year.json'
import stationDelayData from '../station_delay_likelihood_by_hour.json'
import stationRankData from '../station_ranking_with_latlon.json'
import { StationRanking } from './StationRanking'
import { ChartCarousel } from './ChartCarousel'

type StationCardProps = {
  station: Station
  lineColor: string
  isMobile: boolean
  onTouchStart?: (e: React.TouchEvent) => void
  onTouchMove?: (e: React.TouchEvent) => void
  onTouchEnd?: () => void
  onMouseDown?: (e: React.MouseEvent) => void
}

const formatDate = (dateStr: string, timeStr: string) => {
  const date = new Date(dateStr);
  const time = new Date(`2000-01-01T${timeStr}`);
  
  const month = date.toLocaleString('default', { month: 'long' });
  const day = date.getDate();
  const year = date.getFullYear();
  const hours = time.getHours();
  const minutes = time.getMinutes().toString().padStart(2, '0');
  const ampm = hours >= 12 ? 'pm' : 'am';
  const formattedHours = hours % 12 || 12;
  
  const daySuffix = (day % 10 === 1 && day !== 11) ? 'st' :
                   (day % 10 === 2 && day !== 12) ? 'nd' :
                   (day % 10 === 3 && day !== 13) ? 'rd' : 'th';
  
  return `${month} ${day}${daySuffix}, ${year} at ${formattedHours}:${minutes} ${ampm}`;
}

export const StationCard = ({ 
  station, 
  lineColor,
  isMobile,
  onTouchStart,
  onTouchMove,
  onTouchEnd,
  onMouseDown
}: StationCardProps) => {
  if (!station) return null;
  const incidents = getTopIncidentsForStation(station, topIncidents, 50);
  const delayLikelihood = getStationDelayLikelihood(station, stationDelayData);
  const { dangerRank, usageRank, usage, incidentCount } = getStationRanks(station, stationRankData);

  return (
    <Card className={`${isMobile ? 'rounded-t-xl' : 'rounded-lg'} w-full h-full shadow-none border-0 bg-black/60 backdrop-blur-sm flex flex-col`} style={{ borderColor: lineColor }}>
      <div className="flex-none">
        <div 
          className="w-full h-10 flex justify-center items-center touch-none cursor-move bg-black rounded-t-lg"
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
          onMouseDown={onMouseDown}
        >
          <div className="w-12 h-1.5 bg-gray-200 rounded-full" />
        </div>
      </div>
      <CardContent className={`p-0 flex flex-col`}>
        <div className="px-4 py-3 bg-black/80" style={{ borderColor: lineColor }}>
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold truncate max-w-[150px] text-white">{station.name}</h3>
            <div className="flex gap-2 text-sm">
              <StationRanking 
                rank={dangerRank} 
                type="danger" 
                lineColor={lineColor} 
                incidentCount={incidentCount}
              />
              <StationRanking 
                rank={usageRank} 
                type="usage" 
                lineColor={lineColor}
                usage={usage}
              />
            </div>
          </div>
        </div>
        <div className="px-4 flex-1 overflow-y-auto max-h-[calc(70vh-3rem)]">
          <div className="mb-4"/>
          <ChartCarousel 
            delayLikelihood={delayLikelihood}
            incidents={incidents}
            lineColor={lineColor}
            isMobile={isMobile}
          />
          <div className="mt-4">
            <h4 className="text-sm font-medium mb-2 text-white">Top 30 Incidents by Delay</h4>
            {incidents.length > 0 ? (
              <div className="space-y-2">
                {incidents.slice(0, 30).map((incident, index) => (
                  <div key={index} tabIndex={0} style={{ borderColor: lineColor }} className="text-sm border-b pb-2">
                    <div className="flex justify-between">
                      <span className="font-medium text-white">{incident.description}</span>
                      <span className="text-gray-300">{incident.minDelay} min</span>
                    </div>
                    <div className="text-xs text-gray-300">
                      {formatDate(incident.date, incident.time)}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-400">No incident data available</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
} 