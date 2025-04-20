import { StationCard } from './StationCard';
import type { Station } from './map';
import { useState, useRef } from 'react';

type MobileStationCardProps = {
  station: Station;
  lineColor: string;
  isMobile: boolean;
};

export const MobileStationCard = ({ station, lineColor, isMobile }: MobileStationCardProps) => {
  // Height constants
  const MIN_HEIGHT = 12; // Minimum height as percentage of viewport
  const MID_HEIGHT = 40; // Middle height as percentage of viewport
  const MAX_HEIGHT = 75; // Maximum height as percentage of viewport
  const SNAP_THRESHOLD = 27.5; // Threshold between MIN and MID heights
  const SNAP_THRESHOLD_HIGH = 60; // Threshold between MID and MAX heights
  const VELOCITY_THRESHOLD = 0.2; // Threshold for quick flick detection

  const [height, setHeight] = useState(MID_HEIGHT);
  const startY = useRef(0);
  const startHeight = useRef(0);
  const sheetRef = useRef<HTMLDivElement>(null);
  const lastTouchTime = useRef(0);
  const lastTouchY = useRef(0);

  const handleTouchStart = (e: React.TouchEvent) => {
    startY.current = e.touches[0].clientY;
    startHeight.current = height;
    lastTouchTime.current = Date.now();
    lastTouchY.current = e.touches[0].clientY;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!sheetRef.current) return;
    
    const deltaY = startY.current - e.touches[0].clientY;
    const newHeight = Math.min(MAX_HEIGHT, Math.max(MIN_HEIGHT, startHeight.current + (deltaY / window.innerHeight) * 100));
    setHeight(newHeight);
  };

  const handleTouchEnd = () => {
    const currentTime = Date.now();
    const timeDiff = currentTime - lastTouchTime.current;
    const yDiff = lastTouchY.current - startY.current;
    const velocity = Math.abs(yDiff) / timeDiff;

    // If it's a quick flick (high velocity)
    if (velocity > VELOCITY_THRESHOLD) {
      if (yDiff > 0) { // Moving up
        setHeight(MAX_HEIGHT);
      } else { // Moving down
        setHeight(MIN_HEIGHT);
      }
    } else {
      // Regular snap logic
      if (height > SNAP_THRESHOLD_HIGH) {
        setHeight(MAX_HEIGHT);
      } else if (height > SNAP_THRESHOLD) {
        setHeight(MID_HEIGHT);
      } else {
        setHeight(MIN_HEIGHT);
      }
    }
  };

  return (
    <div 
      ref={sheetRef}
      className="fixed bottom-0 left-0 right-0 z-40 shadow-lg transition-all duration-300 ease-out overflow-hidden"
      style={{ 
        height: `${height}vh`,
        transform: `translateY(0)`
      }}
    >
      <div className="h-full flex flex-col">
        <StationCard
          station={station}
          lineColor={lineColor}
          isMobile={isMobile}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        />
      </div>
    </div>
  );
}; 