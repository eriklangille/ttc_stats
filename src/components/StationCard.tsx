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
}

export const StationCard = ({ station, onClose }: StationCardProps) => {
  return (
    <Card className='fixed top-0 left-0 h-12 w-12'>
      <CardContent className="pt-6">
        <div className="aspect-video bg-muted rounded-lg mb-4 flex items-top justify-left">
          <span className="text-muted-foreground">Station Image</span>
        </div>
        <p className="text-muted-foreground">
          This is placeholder text for station information. Here you can add details about the station,
          its history, nearby attractions, or any other relevant information.
        </p>
      </CardContent>
    </Card>
  )
} 