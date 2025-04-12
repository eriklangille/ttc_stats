import { useState, useEffect, useMemo } from 'react'

// Types
type Point = { x: number; y: number }
type RelativePoint = { readonly dx: number; readonly dy: number }
type Station = { distance: number; name: string }
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
      { distance: 1, name: "Kipling" },
      { distance: 28, name: "Islington" },
      { distance: 54, name: "Royal York" },
      { distance: 82, name: "Old Mill" },
      { distance: 110, name: "Jane" },
      { distance: 138, name: "Runnymede" },
      { distance: 165, name: "High Park" },
      { distance: 193, name: "Keele" },
      { distance: 221, name: "Dundas West" },
      { distance: 249, name: "Landsdowne" },
      { distance: 276, name: "Dufferin" },
      { distance: 305, name: "Ossington" },
      { distance: 333, name: "Christie" },
      { distance: 360, name: "Bathurst" },
      { distance: 387, name: "Spadina" },
      { distance: 416, name: "St. George" },
      { distance: 443, name: "Bay" },
      { distance: 471, name: "Bloor-Yonge" },
      { distance: 499, name: "Sherbourne" },
      { distance: 527, name: "Castle Frank" },
      { distance: 555, name: "Broadview" },
      { distance: 583, name: "Chester" },
      { distance: 611, name: "Pape" },
      { distance: 639, name: "Donlands" },
      { distance: 667, name: "Greenwood" },
      { distance: 695, name: "Coxwell" },
      { distance: 723, name: "Woodbine" },
      { distance: 751, name: "Main Street" },
      { distance: 788, name: "Victoria Park" },
      { distance: 875, name: "Warden" },
      { distance: 1000, name: "Kennedy" }
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
      { distance: 1, name: "Finch" },
      { distance: 28, name: "North York Centre" },
      { distance: 54, name: "Sheppard-Yonge" },
      { distance: 110, name: "York Mills" },
      { distance: 167, name: "Lawrence" },
      { distance: 222, name: "Eglinton" },
      { distance: 250, name: "Davisville" },
      { distance: 278, name: "St. Clair" },
      { distance: 305, name: "Summerhill" },
      { distance: 333, name: "Rosedale" },
      { distance: 361, name: "Bloor-Yonge" },
      { distance: 389, name: "Wellesley" },
      { distance: 417, name: "College" },
      { distance: 445, name: "Dundas" },
      { distance: 472, name: "Queen" },
      { distance: 500, name: "King" },
      { distance: 557, name: "Union" },
      { distance: 614, name: "St. Andrew" },
      { distance: 643, name: "Osgoode" },
      { distance: 669, name: "St. Patrick" },
      { distance: 697, name: "Queen's Park" },
      { distance: 725, name: "Museum" },
      { distance: 753, name: "St. George" },
      { distance: 792, name: "Spadina" },
      { distance: 820, name: "Dupont" },
      { distance: 853, name: "St. Clair West" },
      { distance: 930, name: "Eglinton West" },
      { distance: 957, name: "Glencairn" },
      { distance: 985, name: "Lawrence West" },
      { distance: 1013, name: "Yorkdale" },
      { distance: 1041, name: "Wilson" },
      { distance: 1101, name: "Sheppard West" },
      { distance: 1167, name: "Downsview Park" },
      { distance: 1214, name: "Finch West" },
      { distance: 1252, name: "York University" },
      { distance: 1292, name: "Pioneer Village" },
      { distance: 1322, name: "Highway 407" },
      { distance: 1350, name: "Vaughan Metropolitan Centre" }
    ]
  },
  "Sheppard": {
    color: "#A8518A",
    start: { x: 717, y: 266 },
    line: [
      { dx: 225, dy: 0 }
    ],
    stations: [
      { distance: 1, name: "Sheppard-Yonge" },
      { distance: 83, name: "Bayview" },
      { distance: 125, name: "Bessarion" },
      { distance: 168, name: "Leslie" },
      { distance: 225, name: "Don Mills" }
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
  const currentPosition = useMemo(() => getPointAtDistance(points, currentDistance), [points, currentDistance])
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
  translateX?: number
  translateY?: number
}

const Map = ({
  sizeX = 1000,
  sizeY = 1000,
  scale = 3,
  strokeWidth = 10,
  translateX = 0,
  translateY = 0,
}: MapProps) => {
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

  const stationElements = useMemo(() =>
    Object.entries(LINES).map(([lineName, { color, start, line: relativePoints }]) => {
      const points = getAbsolutePoints(start, relativePoints)
      return (
        <g key={`${lineName}-stations`}>
          {LINES[lineName as LineName].stations.map((station, index) => {
            const position = getPointAtDistance(points, station.distance)
            return (
              <g key={`${lineName}-station-${index}`} style={{ zIndex: 3 }}>
                <circle
                  cx={position.x}
                  cy={position.y}
                  r={strokeWidth / 1}
                  fill="white"
                  style={{ zIndex: 3 }}
                  stroke={color}
                  strokeWidth={strokeWidth / 1.5}
                />
                <title>{station.name}</title>
              </g>
            )
          })}
        </g>
      )
    }), [strokeWidth]
  )

  const trainElements = useMemo(() => [
    <Train key="bd-east" line={LINES["Bloor-Danforth"]} startDistance={1} direction="eastbound" color="#00A859" />,
    <Train key="bd-west" line={LINES["Bloor-Danforth"]} startDistance={500} direction="westbound" color="#00A859" />,
    <Train key="yu-east1" line={LINES["Yonge-University"]} startDistance={1} direction="eastbound" color="#FFCC29" />,
    <Train key="yu-east2" line={LINES["Yonge-University"]} startDistance={200} direction="eastbound" color="#FFCC29" />,
    <Train key="yu-east3" line={LINES["Yonge-University"]} startDistance={400} direction="eastbound" color="#FFCC29" />,
    <Train key="yu-east4" line={LINES["Yonge-University"]} startDistance={600} direction="eastbound" color="#FFCC29" />,
    <Train key="yu-west" line={LINES["Yonge-University"]} startDistance={700} direction="westbound" color="#FFCC29" />,
    <Train key="shep-east" line={LINES["Sheppard"]} startDistance={1} direction="eastbound" color="#A8518A" />,
    <Train key="shep-west" line={LINES["Sheppard"]} startDistance={225} direction="westbound" color="#A8518A" />
  ], [])

  return (
    <svg 
      width={sizeX} 
      height={sizeY} 
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        transform: `translate(${translateX}px, ${translateY}px) scale(${scale})`
      }}
    >
      {lineElements}
      {trainElements}
      {stationElements}
    </svg>
  )
}

export default Map