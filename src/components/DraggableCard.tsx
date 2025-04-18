import { useState, useRef, useEffect } from 'react';
import { StationCard } from './StationCard';
import type { Station } from './map';

type DraggableCardProps = {
  station: Station;
  lineColor: string;
};

const STATION_SELECTOR_HEIGHT = 125;
const STATION_SELECTOR_WIDTH = 48;
const MAX_CARD_HEIGHT = '80vh'; // Maximum height of the card

export const DraggableCard = ({ station, lineColor }: DraggableCardProps) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const cardRef = useRef<HTMLDivElement>(null);

  // Initial position - below the StationSelector
  useEffect(() => {
    setPosition({ x: 0, y: STATION_SELECTOR_HEIGHT });
  }, []);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setStartPos({
      x: e.clientX - position.x,
      y: e.clientY - position.y
    });
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging) return;

    const newX = e.clientX - startPos.x;
    const newY = e.clientY - startPos.y;

    const windowHeight = window.innerHeight / 2;
    const windowWidth = window.innerWidth / 2;

    // Prevent card from going above the StationSelector (y < 64)
    const constrainedX = Math.max(-windowWidth + STATION_SELECTOR_WIDTH, newX);
    const constrainedY = Math.max(-windowHeight + STATION_SELECTOR_HEIGHT, newY);

    setPosition({
      x: constrainedX,
      y: constrainedY
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, startPos]);

  return (
    <div
      ref={cardRef}
      className="fixed z-50 w-96"
      style={{
        transform: `translate(${position.x}px, ${position.y}px)`,
        userSelect: 'none',
        maxHeight: MAX_CARD_HEIGHT,
        overflow: 'hidden'
      }}
    >
      <StationCard
        station={station}
        lineColor={lineColor}
        onMouseDown={handleMouseDown}
      />
    </div>
  );
}; 