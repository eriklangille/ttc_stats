import { useState, useEffect, useMemo, useRef } from 'react'
import ttcBg from '../map.svg'

// Types
type Point = { x: number; y: number }
type RelativePoint = { readonly dx: number; readonly dy: number }
export type Station = { distance: number; name: string; line: LineName }
type Line = {
  color: string
  start: Point
  line: readonly RelativePoint[]
  stations: readonly Station[]
}

// Constants
const LINES = {
  "Bloor-Danforth": {
    color: "#00A859",
    start: { x: 250, y: 585 },
    line: [
      { dx: 25, dy: -12 },
      { dx: 725, dy: 0 },
      { dx: 30, dy: -16 },
      { dx: 56, dy: -70 },
      { dx: 50, dy: -50 }
    ],
    stations: [
      { distance: 1, name: "Kipling", line: "Bloor-Danforth"},
      { distance: 28, name: "Islington", line: "Bloor-Danforth" },
      { distance: 54, name: "Royal York", line: "Bloor-Danforth" },
      { distance: 82, name: "Old Mill", line: "Bloor-Danforth" },
      { distance: 110, name: "Jane", line: "Bloor-Danforth" },
      { distance: 138, name: "Runnymede", line: "Bloor-Danforth" },
      { distance: 165, name: "High Park", line: "Bloor-Danforth" },
      { distance: 193, name: "Keele", line: "Bloor-Danforth" },
      { distance: 221, name: "Dundas West", line: "Bloor-Danforth" },
      { distance: 249, name: "Lansdowne", line: "Bloor-Danforth" },
      { distance: 276, name: "Dufferin", line: "Bloor-Danforth" },
      { distance: 305, name: "Ossington", line: "Bloor-Danforth" },
      { distance: 333, name: "Christie", line: "Bloor-Danforth" },
      { distance: 360, name: "Bathurst", line: "Bloor-Danforth" },
      { distance: 387, name: "Spadina", line: "Bloor-Danforth" },
      { distance: 416, name: "St. George", line: "Bloor-Danforth" },
      { distance: 443, name: "Bay", line: "Bloor-Danforth" },
      { distance: 471, name: "Bloor-Yonge", line: "Bloor-Danforth" },
      { distance: 499, name: "Sherbourne", line: "Bloor-Danforth" },
      { distance: 527, name: "Castle Frank", line: "Bloor-Danforth" },
      { distance: 555, name: "Broadview", line: "Bloor-Danforth" },
      { distance: 583, name: "Chester", line: "Bloor-Danforth" },
      { distance: 611, name: "Pape", line: "Bloor-Danforth" },
      { distance: 639, name: "Donlands", line: "Bloor-Danforth" },
      { distance: 667, name: "Greenwood", line: "Bloor-Danforth" },
      { distance: 695, name: "Coxwell", line: "Bloor-Danforth" },
      { distance: 723, name: "Woodbine", line: "Bloor-Danforth" },
      { distance: 751, name: "Main Street", line: "Bloor-Danforth" },
      { distance: 788, name: "Victoria Park", line: "Bloor-Danforth" },
      { distance: 875, name: "Warden", line: "Bloor-Danforth" },
      { distance: 1000, name: "Kennedy", line: "Bloor-Danforth" }
    ]
  },
  "Yonge-University": {
    color: "#FFCC29",
    start: { x: 718, y: 212 },
    line: [
      { dx: 0, dy: 530 },
      { dx: -54, dy: 0 },
      { dx: 0, dy: -168 },
      { dx: -28, dy: -28 },
      { dx: 0, dy: -61 },
      { dx: -55, dy: -55 },
      { dx: -27, dy: -108 },
      { dx: -28, dy: -52 },
      { dx: -58, dy: -29 },
      { dx: -110, dy: -110 },
      { dx: 0, dy: -30 }
    ],
    stations: [
      { distance: 1, name: "Finch", line: "Yonge-University" },
      { distance: 28, name: "North York Centre", line: "Yonge-University" },
      { distance: 54, name: "Sheppard-Yonge", line: "Yonge-University" },
      { distance: 110, name: "York Mills", line: "Yonge-University" },
      { distance: 167, name: "Lawrence", line: "Yonge-University" },
      { distance: 222, name: "Eglinton", line: "Yonge-University" },
      { distance: 250, name: "Davisville", line: "Yonge-University" },
      { distance: 278, name: "St. Clair", line: "Yonge-University" },
      { distance: 305, name: "Summerhill", line: "Yonge-University" },
      { distance: 333, name: "Rosedale", line: "Yonge-University" },
      { distance: 361, name: "Bloor-Yonge", line: "Yonge-University" },
      { distance: 389, name: "Wellesley", line: "Yonge-University" },
      { distance: 417, name: "College", line: "Yonge-University" },
      { distance: 445, name: "Dundas", line: "Yonge-University" },
      { distance: 472, name: "Queen", line: "Yonge-University" },
      { distance: 500, name: "King", line: "Yonge-University" },
      { distance: 557, name: "Union", line: "Yonge-University" },
      { distance: 614, name: "St. Andrew", line: "Yonge-University" },
      { distance: 643, name: "Osgoode", line: "Yonge-University" },
      { distance: 669, name: "St. Patrick", line: "Yonge-University" },
      { distance: 697, name: "Queen's Park", line: "Yonge-University" },
      { distance: 725, name: "Museum", line: "Yonge-University" },
      { distance: 753, name: "St. George", line: "Yonge-University" },
      { distance: 792, name: "Spadina", line: "Yonge-University" },
      { distance: 820, name: "Dupont", line: "Yonge-University" },
      { distance: 853, name: "St. Clair West", line: "Yonge-University" },
      { distance: 930, name: "Eglinton West", line: "Yonge-University" },
      { distance: 957, name: "Glencairn", line: "Yonge-University" },
      { distance: 985, name: "Lawrence West", line: "Yonge-University" },
      { distance: 1013, name: "Yorkdale", line: "Yonge-University" },
      { distance: 1041, name: "Wilson", line: "Yonge-University" },
      { distance: 1101, name: "Sheppard West", line: "Yonge-University" },
      { distance: 1167, name: "Downsview Park", line: "Yonge-University" },
      { distance: 1214, name: "Finch West", line: "Yonge-University" },
      { distance: 1252, name: "York University", line: "Yonge-University" },
      { distance: 1292, name: "Pioneer Village", line: "Yonge-University" },
      { distance: 1322, name: "Highway 407", line: "Yonge-University" },
      { distance: 1350, name: "Vaughan Metropolitan Centre", line: "Yonge-University" }
    ]
  },
  "Sheppard": {
    color: "#A8518A",
    start: { x: 717, y: 266 },
    line: [
      { dx: 225, dy: 0 }
    ],
    stations: [
      { distance: 1, name: "Sheppard-Yonge", line: "Sheppard" },
      { distance: 83, name: "Bayview", line: "Sheppard" },
      { distance: 125, name: "Bessarion", line: "Sheppard" },
      { distance: 168, name: "Leslie", line: "Sheppard" },
      { distance: 225, name: "Don Mills", line: "Sheppard" }
    ]
  }
} as const

type LineName = keyof typeof LINES

// Utility functions
const getAbsolutePoints = (start: Point, relativePoints: readonly RelativePoint[]): Point[] => {
  const points: Point[] = [start]
  let currentX = start.x
  let currentY = start.y

  for (const point of relativePoints) {
    currentX += point.dx
    currentY += point.dy
    points.push({ x: currentX, y: currentY })
  }

  return points
}

const getPointAtDistance = (points: Point[], targetDistance: number): Point => {
  let accumulatedDistance = 0
  
  for (let i = 0; i < points.length - 1; i++) {
    const dx = points[i + 1].x - points[i].x
    const dy = points[i + 1].y - points[i].y
    const segmentLength = Math.sqrt(dx * dx + dy * dy)
    
    if (accumulatedDistance + segmentLength >= targetDistance) {
      const segmentDistance = targetDistance - accumulatedDistance
      const segmentPercent = segmentDistance / segmentLength
      return {
        x: points[i].x + (points[i + 1].x - points[i].x) * segmentPercent,
        y: points[i].y + (points[i + 1].y - points[i].y) * segmentPercent,
      }
    }
    accumulatedDistance += segmentLength
  }

  return points[points.length - 1]
}

const getAngleAtDistance = (points: Point[], distance: number): number => {
  let accumulatedDistance = 0
  for (let i = 0; i < points.length - 1; i++) {
    const dx = points[i + 1].x - points[i].x
    const dy = points[i + 1].y - points[i].y
    const segmentLength = Math.sqrt(dx * dx + dy * dy)
    
    if (accumulatedDistance + segmentLength >= distance) {
      return Math.atan2(dy, dx) * (180 / Math.PI)
    }
    accumulatedDistance += segmentLength
  }
  return 0
}

// Add this function after the getAngleAtDistance function
const findNextStation = (currentStation: Station, direction: 'up' | 'down' | 'left' | 'right'): Station | null => {
  const line = LINES[currentStation.line];
  const points = getAbsolutePoints(line.start, line.line);
  const currentPosition = getPointAtDistance(points, currentStation.distance);
  
  // Get all stations from all lines
  const allStations = Object.entries(LINES).flatMap(([lineName, lineData]) => {
    const points = getAbsolutePoints(lineData.start, lineData.line);
    return lineData.stations.map(station => ({
      ...station,
      line: lineName as LineName,
      position: getPointAtDistance(points, station.distance)
    }));
  });

  // Filter stations based on direction
  const filteredStations = allStations.filter(station => {
    const dx = station.position.x - currentPosition.x;
    const dy = station.position.y - currentPosition.y;
    
    switch (direction) {
      case 'up':
        return dy < 0;
      case 'down':
        return dy > 0;
      case 'left':
        return dx < 0;
      case 'right':
        return dx > 0;
    }
  });

  if (filteredStations.length === 0) return null;

  // Find the closest station in the filtered direction
  return filteredStations.reduce((closest, current) => {
    const closestDist = Math.hypot(
      closest.position.x - currentPosition.x,
      closest.position.y - currentPosition.y
    );
    const currentDist = Math.hypot(
      current.position.x - currentPosition.x,
      current.position.y - currentPosition.y
    );
    return currentDist < closestDist ? current : closest;
  });
};

// Components
type TrainProps = {
  line: Line
  startDistance: number
  direction: 'eastbound' | 'westbound'
  color: string
}

const Train = ({ line, startDistance, direction: initialDirection, color }: TrainProps) => {
  const [currentDistance, setCurrentDistance] = useState(startDistance)
  const [currentStationIndex, setCurrentStationIndex] = useState(
    initialDirection === 'eastbound' ? 0 : line.stations.length - 1
  )
  const [isPaused, setIsPaused] = useState(false)
  const [direction, setDirection] = useState(initialDirection)

  const points = useMemo(() => getAbsolutePoints(line.start, line.line), [line])
  const endDistance = line.stations[line.stations.length - 1].distance

  useEffect(() => {
    if (isPaused) return

    const interval = setInterval(() => {
      setCurrentDistance(prev => {
        const nextDistance = prev + (direction === 'westbound' ? -1 : 1)
        
        // Handle end of line
        if (nextDistance >= endDistance && direction === 'eastbound') {
          setIsPaused(true)
          setTimeout(() => {
            setDirection('westbound')
            setCurrentStationIndex(line.stations.length - 1)
            setIsPaused(false)
          }, 1000)
          return prev
        }
        
        if (nextDistance <= 1 && direction === 'westbound') {
          setIsPaused(true)
          setTimeout(() => {
            setDirection('eastbound')
            setCurrentStationIndex(0)
            setIsPaused(false)
          }, 1000)
          return prev
        }

        // Handle station stops
        const nextStationIndex = direction === 'eastbound' 
          ? currentStationIndex + 1 
          : currentStationIndex - 1
        
        if (nextStationIndex >= 0 && nextStationIndex < line.stations.length) {
          const nextStation = line.stations[nextStationIndex]
          const currentStation = line.stations[currentStationIndex]
          
          const isPastCurrentStation = direction === 'eastbound'
            ? nextDistance > currentStation.distance
            : nextDistance < currentStation.distance
          
          if (isPastCurrentStation) {
            const shouldStop = direction === 'eastbound'
              ? nextDistance >= nextStation.distance
              : nextDistance <= nextStation.distance
              
            if (shouldStop) {
              setIsPaused(true)
              setTimeout(() => {
                setCurrentStationIndex(nextStationIndex)
                setIsPaused(false)
              }, 1000)
              return prev
            }
          }
        }
        
        return nextDistance
      })
    }, 20)

    return () => clearInterval(interval)
  }, [currentStationIndex, isPaused, direction, endDistance, line.stations])

  const trainCars = useMemo(() => 
    Array.from({ length: 6 }).map((_, index) => {
      const carOffset = (index - 2.5) * 2.5
      const carDistance = currentDistance + carOffset
      const position = getPointAtDistance(points, carDistance)
      const angle = getAngleAtDistance(points, carDistance)

      return (
        <rect
          key={index}
          x={position.x - 2}
          y={position.y - 1.5}
          width={4}
          height={3}
          rx={1}
          fill={color}
          style={{ zIndex: 1 }}
          transform={`rotate(${angle}, ${position.x}, ${position.y})`}
        />
      )
    }), [points, currentDistance, color]
  )

  return <>{trainCars}</>
}

type MapProps = {
  sizeX?: number
  sizeY?: number
  scale?: number
  strokeWidth?: number
  selectedStation?: Station | null
  isMobile?: boolean
  onStationSelect: (station: Station | null) => void
}

const Map = ({
  sizeX = 1000,
  sizeY = 1000,
  scale: initialScale = 3,
  strokeWidth = 10,
  selectedStation = null,
  isMobile = false,
  onStationSelect,
}: MapProps) => {
  // Find initial Sheppard-Yonge station position
  const initialStation = LINES["Yonge-University"].stations.find(s => s.name === "Sheppard-Yonge")!;
  const initialPoints = getAbsolutePoints(LINES["Yonge-University"].start, LINES["Yonge-University"].line);
  const initialPosition = getPointAtDistance(initialPoints, initialStation.distance);
  const midX = sizeX / 2;
  const midY = sizeY / 2;
  const offsetX = initialPosition.x - midX;
  const offsetY = initialPosition.y - midY;
  const initialTranslateX = -offsetX * initialScale;
  const initialTranslateY = -offsetY * initialScale;

  // Animation state
  const [adjustedTranslateX, setAdjustedTranslateX] = useState(initialTranslateX);
  const [adjustedTranslateY, setAdjustedTranslateY] = useState(initialTranslateY);
  const [scale, setScale] = useState(initialScale);
  const [lastDistance, setLastDistance] = useState<number | null>(null);
  const [targetScale, setTargetScale] = useState(initialScale);
  const [targetTranslateX, setTargetTranslateX] = useState(initialTranslateX);
  const [targetTranslateY, setTargetTranslateY] = useState(initialTranslateY);
  const animationFrameRef = useRef<number>(0);
  const lastAnimationTime = useRef<number>(0);
  const isOnCooldown = useRef(false);
  const COOLDOWN_DURATION = 900;

  // Add ref for the map container
  const mapContainerRef = useRef<HTMLDivElement>(null);

  // Calculate target position for a given station and scale
  const calculateTargetPosition = (station: Station, currentScale: number) => {
    const line = LINES[station.line];
    const points = getAbsolutePoints(line.start, line.line);
    const stationPosition = getPointAtDistance(points, station.distance);

    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    const midX = sizeX / 2;
    const midY = sizeY / 2;

    const offsetX = stationPosition.x - midX;
    const offsetY = stationPosition.y - midY;

    return {
      translateX: -offsetX * currentScale - (sizeX - viewportWidth) / 2,
      translateY: -offsetY * currentScale - (sizeY - viewportHeight) / 2
    };
  };

  // Update target position when selected station or scale changes
  useEffect(() => {
    if (!selectedStation) return;

    const { translateX, translateY } = calculateTargetPosition(selectedStation, targetScale);
    setTargetTranslateX(translateX);
    setTargetTranslateY(translateY);
  }, [selectedStation, targetScale, sizeX, sizeY]);

  // Combined smooth animation for both scale and position
  useEffect(() => {
    if (scale === targetScale && 
        adjustedTranslateX === targetTranslateX && 
        adjustedTranslateY === targetTranslateY) return;

    const animate = () => {
      const now = performance.now();
      const timeSinceLastChange = now - lastAnimationTime.current;
      
      // Only update if enough time has passed (16ms = ~60fps)
      if (timeSinceLastChange >= 16) {
        const easing = 0.2; // Increased from 0.1 to 0.3 for faster animation
        
        // Calculate new scale
        const newScale = scale + (targetScale - scale) * easing;
        
        // Calculate new position
        const newTranslateX = adjustedTranslateX + (targetTranslateX - adjustedTranslateX) * easing;
        const newTranslateY = adjustedTranslateY + (targetTranslateY - adjustedTranslateY) * easing;
        
        // If we're very close to the target, just set it directly
        if (Math.abs(newScale - targetScale) < 0.001 &&
            Math.abs(newTranslateX - targetTranslateX) < 0.001 &&
            Math.abs(newTranslateY - targetTranslateY) < 0.001) {
          setScale(targetScale);
          setAdjustedTranslateX(targetTranslateX);
          setAdjustedTranslateY(targetTranslateY);
        } else {
          setScale(newScale);
          setAdjustedTranslateX(newTranslateX);
          setAdjustedTranslateY(newTranslateY);
          lastAnimationTime.current = now;
          animationFrameRef.current = requestAnimationFrame(animate);
        }
      } else {
        animationFrameRef.current = requestAnimationFrame(animate);
      }
    };

    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [targetScale, scale, targetTranslateX, targetTranslateY, adjustedTranslateX, adjustedTranslateY]);

  // Add scroll and touch handlers
  const handleScroll = (e: WheelEvent) => {
    if (!selectedStation || isOnCooldown.current) return;
    
    // Check if the scroll event originated from within the map container
    const target = e.target as HTMLElement;
    const mapContainer = mapContainerRef.current;
    if (!mapContainer || !mapContainer.contains(target)) return;
    
    e.preventDefault();
    
    // Determine direction based on scroll
    const direction = Math.abs(e.deltaX) > Math.abs(e.deltaY)
      ? e.deltaX > 0 ? 'right' : 'left'
      : e.deltaY > 0 ? 'down' : 'up';
    
    const nextStation = findNextStation(selectedStation, direction);
    if (nextStation) {
      isOnCooldown.current = true;
      onStationSelect(nextStation);
      
      // Reset cooldown after duration
      setTimeout(() => {
        isOnCooldown.current = false;
      }, COOLDOWN_DURATION);
    }
  };

  const handleTouchStart = (e: TouchEvent) => {
    if (e.touches.length === 2) {
      const touch1 = e.touches[0];
      const touch2 = e.touches[1];
      const distance = Math.hypot(
        touch2.clientX - touch1.clientX,
        touch2.clientY - touch1.clientY
      );
      setLastDistance(distance);
    }
  };

  const handleTouchMove = (e: TouchEvent) => {
    if (e.touches.length === 2 && lastDistance !== null) {
      e.preventDefault();
      const touch1 = e.touches[0];
      const touch2 = e.touches[1];
      const distance = Math.hypot(
        touch2.clientX - touch1.clientX,
        touch2.clientY - touch1.clientY
      );
      
      const scaleChange = distance / lastDistance;
      const newTargetScale = targetScale * scaleChange;
      
      // Limit scale between 1 and 5
      setTargetScale(Math.min(Math.max(newTargetScale, 1), 5));
      setLastDistance(distance);
    }
  };

  const handleTouchEnd = () => {
    setLastDistance(null);
  };

  useEffect(() => {
    if (selectedStation) {
      if (isMobile) {
        const mapContainer = mapContainerRef.current;
        if (mapContainer) {
          mapContainer.addEventListener('touchstart', handleTouchStart, { passive: false });
          mapContainer.addEventListener('touchmove', handleTouchMove, { passive: false });
          mapContainer.addEventListener('touchend', handleTouchEnd);
        }
      } else {
        document.addEventListener('wheel', handleScroll, { passive: false });
      }
    }
    
    return () => {
      if (isMobile) {
        const mapContainer = mapContainerRef.current;
        if (mapContainer) {
          mapContainer.removeEventListener('touchstart', handleTouchStart);
          mapContainer.removeEventListener('touchmove', handleTouchMove);
          mapContainer.removeEventListener('touchend', handleTouchEnd);
        }
      } else {
        document.removeEventListener('wheel', handleScroll);
      }
    };
  }, [selectedStation, isMobile, lastDistance]);

  const lineElements = useMemo(() => 
    Object.entries(LINES).map(([lineName, { color, start, line: relativePoints }]) => {
      const points = getAbsolutePoints(start, relativePoints)
      return (
        <g key={lineName}>
          {points.map((point, index) => {
            if (index === points.length - 1) return null
            return (
              <line 
                key={`${lineName}-${index}`}
                x1={point.x} 
                y1={point.y} 
                x2={points[index + 1].x} 
                y2={points[index + 1].y} 
                stroke={color} 
                strokeLinecap="round" 
                strokeWidth={strokeWidth}
                style={{ zIndex: 0 }}
              />
            )
          })}
        </g>
      )
    }), [strokeWidth]
  )

  const stationElements = useMemo(() => {
    // First render non-selected line stations
    const nonSelectedLineStations = Object.entries(LINES)
      .filter(([lineName]) => lineName !== selectedStation?.line)
      .map(([lineName, { color, start, line: relativePoints }]) => {
        const points = getAbsolutePoints(start, relativePoints)
        return (
          <g key={`${lineName}-stations`}>
            {LINES[lineName as LineName].stations.map((station, index) => {
              const position = getPointAtDistance(points, station.distance)
              return (
                <g 
                  key={`${lineName}-station-${index}`} 
                  onClick={() => onStationSelect({ ...station, line: lineName as LineName })}
                  className="cursor-pointer"
                >
                  {/* Invisible hitbox circle */}
                  <circle
                    cx={position.x}
                    cy={position.y}
                    r={strokeWidth * 2.5} // Larger hitbox
                    fill="transparent"
                    style={{ pointerEvents: 'all' }}
                  />
                  {/* Visual circle */}
                  <circle
                    cx={position.x}
                    cy={position.y}
                    r={strokeWidth / 1}
                    fill="white"
                    stroke={color}
                    strokeWidth={strokeWidth / 1.5}
                  />
                  <title>{station.name}</title>
                </g>
              )
            })}
          </g>
        )
      })

    // Then render selected line stations on top
    const selectedLineStations = selectedStation ? Object.entries(LINES)
      .filter(([lineName]) => lineName === selectedStation.line)
      .map(([lineName, { color, start, line: relativePoints }]) => {
        const points = getAbsolutePoints(start, relativePoints)
        return (
          <g key={`${lineName}-stations`}>
            {LINES[lineName as LineName].stations.map((station, index) => {
              const position = getPointAtDistance(points, station.distance)
              const isSelected = selectedStation?.name === station.name && selectedStation?.line === lineName
              const isUnionStation = station.name === "Union"
              const isBelowText = isUnionStation || lineName === "Bloor-Danforth" || lineName === "Sheppard"
              return (
                <g 
                  key={`${lineName}-station-${index}`} 
                  onClick={() => onStationSelect({ ...station, line: lineName as LineName })}
                  className="cursor-pointer"
                >
                  {/* Invisible hitbox circle */}
                  <circle
                    cx={position.x}
                    cy={position.y}
                    r={strokeWidth * 2} // Larger hitbox
                    fill="transparent"
                    style={{ pointerEvents: 'all' }}
                  />
                  {/* Visual circle */}
                  <circle
                    cx={position.x}
                    cy={position.y}
                    r={isSelected ? strokeWidth * 1.2 : strokeWidth / 1}
                    fill={isSelected ? color : "white"}
                    stroke={color}
                    strokeWidth={strokeWidth / 1.5}
                  />
                  {isSelected && (
                    <text
                      x={position.x + (isBelowText ? 0 : -6)}
                      y={position.y + (isBelowText ? 15 : 3)}
                      textAnchor={isBelowText ? "middle" : "end"}
                      fill={color}
                      style={{
                        fontSize: '8px',
                        fontWeight: 'bold',
                        pointerEvents: 'none',
                        userSelect: 'none'
                      }}
                    >
                      {station.name}
                    </text>
                  )}
                  <title>{station.name}</title>
                </g>
              )
            })}
          </g>
        )
      }) : []

    return [...nonSelectedLineStations, ...selectedLineStations]
  }, [strokeWidth, selectedStation, onStationSelect])

  const trainElements = useMemo(() => [
    // Bloor-Danforth trains
    <Train key="bd-east1" line={LINES["Bloor-Danforth"]} startDistance={1} direction="eastbound" color="#00A859" />,
    <Train key="bd-east2" line={LINES["Bloor-Danforth"]} startDistance={250} direction="eastbound" color="#00A859" />,
    <Train key="bd-east3" line={LINES["Bloor-Danforth"]} startDistance={500} direction="eastbound" color="#00A859" />,
    <Train key="bd-east4" line={LINES["Bloor-Danforth"]} startDistance={750} direction="eastbound" color="#00A859" />,
    <Train key="bd-west1" line={LINES["Bloor-Danforth"]} startDistance={1000} direction="westbound" color="#00A859" />,
    <Train key="bd-west2" line={LINES["Bloor-Danforth"]} startDistance={750} direction="westbound" color="#00A859" />,
    <Train key="bd-west3" line={LINES["Bloor-Danforth"]} startDistance={500} direction="westbound" color="#00A859" />,
    <Train key="bd-west4" line={LINES["Bloor-Danforth"]} startDistance={250} direction="westbound" color="#00A859" />,
    
    // Yonge-University trains
    <Train key="yu-east1" line={LINES["Yonge-University"]} startDistance={1} direction="eastbound" color="#FFCC29" />,
    <Train key="yu-east2" line={LINES["Yonge-University"]} startDistance={200} direction="eastbound" color="#FFCC29" />,
    <Train key="yu-east3" line={LINES["Yonge-University"]} startDistance={400} direction="eastbound" color="#FFCC29" />,
    <Train key="yu-east4" line={LINES["Yonge-University"]} startDistance={600} direction="eastbound" color="#FFCC29" />,
    <Train key="yu-east5" line={LINES["Yonge-University"]} startDistance={800} direction="eastbound" color="#FFCC29" />,
    <Train key="yu-east6" line={LINES["Yonge-University"]} startDistance={1000} direction="eastbound" color="#FFCC29" />,
    <Train key="yu-east7" line={LINES["Yonge-University"]} startDistance={1200} direction="eastbound" color="#FFCC29" />,
    <Train key="yu-west1" line={LINES["Yonge-University"]} startDistance={1350} direction="westbound" color="#FFCC29" />,
    <Train key="yu-west2" line={LINES["Yonge-University"]} startDistance={1150} direction="westbound" color="#FFCC29" />,
    <Train key="yu-west3" line={LINES["Yonge-University"]} startDistance={950} direction="westbound" color="#FFCC29" />,
    <Train key="yu-west4" line={LINES["Yonge-University"]} startDistance={750} direction="westbound" color="#FFCC29" />,
    <Train key="yu-west5" line={LINES["Yonge-University"]} startDistance={550} direction="westbound" color="#FFCC29" />,
    <Train key="yu-west6" line={LINES["Yonge-University"]} startDistance={350} direction="westbound" color="#FFCC29" />,
    <Train key="yu-west7" line={LINES["Yonge-University"]} startDistance={150} direction="westbound" color="#FFCC29" />,
    
    // Sheppard trains (unchanged)
    <Train key="shep-east" line={LINES["Sheppard"]} startDistance={1} direction="eastbound" color="#A8518A" />,
    <Train key="shep-west" line={LINES["Sheppard"]} startDistance={225} direction="westbound" color="#A8518A" />
  ], [])

  return (
    <div
      ref={mapContainerRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        transform: `translate(${adjustedTranslateX}px, ${adjustedTranslateY}px) scale(${scale})`,
        backgroundImage: `url(${ttcBg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'bottom 0px right -50px',
        backgroundRepeat: 'no-repeat',
        width: '1500px',
        height: '1000px',
      }}
    >
      <svg 
        width={sizeX} 
        height={sizeY} 
      >
        {lineElements}
        {trainElements}
        {stationElements}
      </svg>
    </div>
  )
}

export default Map

export { LINES }