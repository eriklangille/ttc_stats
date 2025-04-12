import type { Station } from './map'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Card, CardContent } from "@/components/ui/card"
import { X } from "lucide-react"

type StationCardProps = {
  station: Station
  onClose: () => void
  lineColor: string
  position: { x: number; y: number }
}

export const StationCard = ({ station, onClose, lineColor, position }: StationCardProps) => {
  return (
    <div 
      className="fixed z-50"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        transform: 'translate(-50%, -100%)',
      }}
    >
      <Card className="w-64 shadow-xl" style={{ borderColor: lineColor }}>
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
          <div className="aspect-video bg-muted rounded-lg mb-4 flex items-center justify-center">
            <span className="text-muted-foreground">Station Image</span>
          </div>
          <p className="text-sm text-muted-foreground">
            This is placeholder text for station information. Here you can add details about the station,
            its history, nearby attractions, or any other relevant information.
          </p>
        </CardContent>
      </Card>
    </div>
  )
} 