import { StationCard } from './StationCard';
import type { Station } from './map';
import { useState, useRef } from 'react';

type MobileStationCardProps = {
  station: Station;
  lineColor: string;
};

export const MobileStationCard = ({ station, lineColor }: MobileStationCardProps) => {
  const [isOpen, setIsOpen] = useState(true);
  const [height, setHeight] = useState(40); // percentage of viewport height
  const startY = useRef(0);
  const startHeight = useRef(0);
  const sheetRef = useRef<HTMLDivElement>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    startY.current = e.touches[0].clientY;
    startHeight.current = height;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!sheetRef.current) return;
    
    const deltaY = startY.current - e.touches[0].clientY;
    const newHeight = Math.min(80, Math.max(40, startHeight.current + (deltaY / window.innerHeight) * 100));
    setHeight(newHeight);
  };

  const handleTouchEnd = () => {
    // Snap to nearest position
    if (height > 60) {
      setHeight(80);
    } else {
      setHeight(40);
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      ref={sheetRef}
      className="fixed bottom-0 left-0 right-0 z-50 rounded-t-2xl shadow-lg transition-transform duration-200"
      style={{ 
        height: `${height}vh`,
        transform: `translateY(${isOpen ? '0' : '100%'})`
      }}
    >
      <StationCard
        station={station}
        lineColor={lineColor}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      />
    </div>
  );
}; 