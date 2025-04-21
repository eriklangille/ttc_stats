import { useState, useRef, useEffect } from 'react';
import { AboutCard } from './AboutCard';

type DraggableAboutCardProps = {
  isMobile: boolean;
  onClose: () => void;
  lineColor: string;
};

const STATION_SELECTOR_HEIGHT = 125;
const STATION_SELECTOR_WIDTH = 15;
const MAX_CARD_HEIGHT = '80vh';

export const DraggableAboutCard = ({ isMobile, onClose, lineColor }: DraggableAboutCardProps) => {
  const [position, setPosition] = useState({ x: STATION_SELECTOR_WIDTH, y: STATION_SELECTOR_HEIGHT });
  const [isDragging, setIsDragging] = useState(false);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setPosition({ x: STATION_SELECTOR_WIDTH, y: STATION_SELECTOR_HEIGHT });
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

    const constrainedX = Math.max(STATION_SELECTOR_WIDTH, newX);
    const constrainedY = Math.max(STATION_SELECTOR_HEIGHT, newY);

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

  if (isMobile) {
    return <AboutCard isMobile={isMobile} onClose={onClose} lineColor={lineColor} />;
  }

  return (
    <div
      ref={cardRef}
      className="fixed z-40 w-96"
      style={{
        transform: `translate(${position.x}px, ${position.y}px)`,
        userSelect: 'none',
        maxHeight: MAX_CARD_HEIGHT,
        overflow: 'hidden'
      }}
    >
      <div onMouseDown={handleMouseDown}>
        <AboutCard isMobile={isMobile} onClose={onClose} lineColor={lineColor} />
      </div>
    </div>
  );
}; 