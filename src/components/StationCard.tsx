import type { Station } from './map'
import { Card, CardContent } from "@/components/ui/card"
import { X } from "lucide-react"
import { getTopIncidentsForStation } from '../utils/incidents'
import data from '../all_stations_top_incidents_by_year.json'

type StationCardProps = {
  station: Station
  onClose: () => void
  lineColor: string
}

export const StationCard = ({ station, onClose, lineColor }: StationCardProps) => {
  if (!station) return null;
  const incidents = getTopIncidentsForStation(station, data);

  return (
    <Card className="w-96 shadow-xl border-2 m-4" style={{ borderColor: lineColor }}>
      <CardContent className="p-4">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-lg font-semibold">{station.name}</h3>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={16} />
          </button>
        </div>
        
        <div className="mt-4">
          <h4 className="text-sm font-medium mb-2">Top 10 Incidents</h4>
          {incidents.length > 0 ? (
            <div className="space-y-2">
              {incidents.map((incident, index) => (
                <div key={index} className="text-sm border-b pb-2">
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