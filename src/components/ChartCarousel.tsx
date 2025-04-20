import { useState, useRef, useEffect } from 'react'
import { StationDelayChart } from './StationDelayChart'
import { StationIncidentChart } from './StationIncidentChart'
import type { Incident } from '../utils/read_data'

type ChartCarouselProps = {
  delayLikelihood: { hour: number; likelihood: number }[]
  incidents: Incident[]
  lineColor: string
  isMobile: boolean
}

export const ChartCarousel = ({ delayLikelihood, incidents, lineColor, isMobile }: ChartCarouselProps) => {
  const [activeChart, setActiveChart] = useState(0)
  const [touchStart, setTouchStart] = useState(0)
  const [touchEnd, setTouchEnd] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX)
  }

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return

    const distance = touchStart - touchEnd
    const isLeftSwipe = distance > 50
    const isRightSwipe = distance < -50

    if (isLeftSwipe && activeChart < 1) {
      setActiveChart(activeChart + 1)
    }
    if (isRightSwipe && activeChart > 0) {
      setActiveChart(activeChart - 1)
    }

    setTouchStart(0)
    setTouchEnd(0)
  }

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true)
    setTouchStart(e.clientX)
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return
    setTouchEnd(e.clientX)
  }

  const handleMouseUp = () => {
    if (!isDragging) return

    const distance = touchStart - touchEnd
    const isLeftSwipe = distance > 50
    const isRightSwipe = distance < -50

    if (isLeftSwipe && activeChart < 1) {
      setActiveChart(activeChart + 1)
    }
    if (isRightSwipe && activeChart > 0) {
      setActiveChart(activeChart - 1)
    }

    setIsDragging(false)
    setTouchStart(0)
    setTouchEnd(0)
  }

  const handleMouseLeave = () => {
    if (isDragging) {
      setIsDragging(false)
      setTouchStart(0)
      setTouchEnd(0)
    }
  }

  // Auto-scroll to active chart
  useEffect(() => {
    if (containerRef.current) {
      const scrollWidth = containerRef.current.scrollWidth
      const itemWidth = scrollWidth / 2
      containerRef.current.scrollTo({
        left: activeChart * itemWidth,
        behavior: 'smooth'
      })
    }
  }, [activeChart])

  return (
    <div className="relative">
      <div 
        ref={containerRef}
        className="overflow-hidden select-none"
        onTouchStart={isMobile ? handleTouchStart : undefined}
        onTouchMove={isMobile ? handleTouchMove : undefined}
        onTouchEnd={isMobile ? handleTouchEnd : undefined}
        onMouseDown={!isMobile ? handleMouseDown : undefined}
        onMouseMove={!isMobile ? handleMouseMove : undefined}
        onMouseUp={!isMobile ? handleMouseUp : undefined}
        onMouseLeave={!isMobile ? handleMouseLeave : undefined}
        style={{ cursor: isMobile ? 'default' : isDragging ? 'grabbing' : 'grab' }}
      >
        <div className="flex w-full">
          <div className="flex-none w-full">
            <h4 className="text-sm font-medium mb-2 text-white">Delay Likelihood by Hour</h4>
            <StationDelayChart delayLikelihood={delayLikelihood} lineColor={lineColor} />
          </div>
          <div className="flex-none w-full">
            <h4 className="text-sm font-medium mb-2 text-white">Top Incident Types</h4>
            <StationIncidentChart incidents={incidents} lineColor={lineColor} />
          </div>
        </div>
      </div>

      <div className="flex justify-center gap-1.5 mt-0">
        <button
          onClick={() => setActiveChart(0)}
          className={`w-2 h-2 rounded-full cursor-pointer transition-colors ${
            activeChart === 0 
              ? 'bg-white' 
              : 'bg-white/30'
          }`}
          aria-label="Show delay likelihood chart"
        />
        <button
          onClick={() => setActiveChart(1)}
          className={`w-2 h-2 rounded-full cursor-pointer transition-colors ${
            activeChart === 1 
              ? 'bg-white' 
              : 'bg-white/30'
          }`}
          aria-label="Show incident types chart"
        />
      </div>
    </div>
  )
} 