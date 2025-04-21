import * as React from "react"
import { TriangleAlert, Users } from "lucide-react"
import { cn } from "@/lib/utils"

type StationRankingProps = {
  rank: number
  type: 'danger' | 'usage'
  lineColor: string
  usage?: number
  incidentCount?: number
}

export const StationRanking = ({ rank, type, lineColor, usage, incidentCount }: StationRankingProps) => {
  const [isOpen, setIsOpen] = React.useState(false)

  const getIcon = () => {
    if (type === 'danger') return <TriangleAlert size={16} />
    return <Users size={16} />
  }

  const getDescription = () => {
    if (type === 'danger') {
      return 'This rank is based on the number and severity of incidents at this station. A lower number indicates a higher likelihood of delays and issues.'
    }
    return 'This rank is based on the number of customers travelling to and from each station platform on a typical weekday. A lower number indicates higher usage.'
  }

  return (
    <div className="relative">
      <span 
        className="px-2 py-1 rounded-md text-nowrap flex items-center backdrop-blur-sm gap-1 cursor-pointer transition-all border-0 font-semibold text-black"
        style={{ backgroundColor: `${lineColor}` }}
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            setIsOpen(!isOpen);
          }
        }}
        onTouchStart={() => setIsOpen(!isOpen)}
        onTouchEnd={() => setIsOpen(!isOpen)}
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
      >
        {getIcon()}
        #{rank} of 74
      </span>
      <div 
        className={cn(
          "absolute z-50 w-[285px] text-white p-2 rounded-md border-1 bg-black/60 backdrop-blur-sm transition-all duration-200",
          isOpen ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none",
          type === 'usage' ? "-left-[195px]" : "-left-[150px]",
          "top-[calc(100%+8px)]"
        )}
        style={{ borderColor: `${lineColor}` }}
      >
        <p className="text-sm">{getDescription()}</p>
        {type === 'usage' && usage && (
          <div className="mt-2">
            <p className="text-sm font-medium">Daily Usage</p>
            <p className="text-2xl font-bold">{usage.toLocaleString()}</p>
            <p className="text-xs">customers per weekday</p>
          </div>
        )}
        {type === 'danger' && incidentCount && (
          <div className="mt-2">
            <p className="text-sm font-medium">Incident Count</p>
            <p className="text-2xl font-bold">{incidentCount.toLocaleString()}</p>
            <p className="text-xs">incidents from 2022 to 2024</p>
          </div>
        )}
      </div>
    </div>
  )
} 