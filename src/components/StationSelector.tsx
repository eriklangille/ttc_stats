import { useState, useEffect, useMemo } from 'react';
import { LINES } from './map';
import { ChevronDown, MapPin } from 'lucide-react';
import stationRankData from '../station_ranking_with_latlon.json';

type LineName = keyof typeof LINES;
type Station = { distance: number; name: string; line: LineName };
type Point = { x: number; y: number };
type RelativePoint = { readonly dx: number; readonly dy: number };

// Station icon component
const StationIcon = ({ color }: { color: string }) => (
  <svg width="16" height="16" viewBox="0 0 180 89" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M165 24C173.284 24 180 32.7304 180 43.5C180 54.2696 173.284 63 165 63H15C6.71573 63 0 54.2696 0 43.5C0 32.7304 6.71573 24 15 24H165Z" fill={color}/>
    <path d="M89.9993 77.7832C108.409 77.7832 123.333 62.8594 123.333 44.4499C123.333 26.0404 108.409 11.1166 89.9993 11.1166C71.5899 11.1166 56.666 26.0404 56.666 44.4499C56.666 62.8594 71.5899 77.7832 89.9993 77.7832Z" fill="white"/>
    <path d="M112.204 44.4499C112.204 32.1769 102.26 22.2331 89.987 22.2331C77.714 22.2331 67.7702 32.1769 67.7702 44.4499C67.7702 56.7229 77.714 66.6667 89.987 66.6667C102.26 66.6667 112.204 56.7229 112.204 44.4499ZM134.437 44.4499C134.437 68.9959 114.533 88.8997 89.987 88.8997C65.441 88.8997 45.5371 68.9959 45.5371 44.4499C45.5371 19.9039 65.441 0 89.987 0C114.533 0 134.437 19.9039 134.437 44.4499Z" fill={color}/>
  </svg>
);

export const StationSelector = ({ onStationSelect, selectedStation, lineColor, isMobile }: { 
  onStationSelect: (station: Station) => void;
  isMobile: boolean;
  selectedStation: Station | null;
  lineColor: string;
}) => {
  // Utility functions from map.tsx
  const getAbsolutePoints = (start: Point, relativePoints: readonly RelativePoint[]): Point[] => {
    const points: Point[] = [start];
    let currentX = start.x;
    let currentY = start.y;

    for (const point of relativePoints) {
      currentX += point.dx;
      currentY += point.dy;
      points.push({ x: currentX, y: currentY });
    }

    return points;
  };

  const getPointAtDistance = (points: Point[], targetDistance: number): Point => {
    let accumulatedDistance = 0;
    
    for (let i = 0; i < points.length - 1; i++) {
      const dx = points[i + 1].x - points[i].x;
      const dy = points[i + 1].y - points[i].y;
      const segmentLength = Math.sqrt(dx * dx + dy * dy);
      
      if (accumulatedDistance + segmentLength >= targetDistance) {
        const segmentDistance = targetDistance - accumulatedDistance;
        const segmentPercent = segmentDistance / segmentLength;
        return {
          x: points[i].x + (points[i + 1].x - points[i].x) * segmentPercent,
          y: points[i].y + (points[i + 1].y - points[i].y) * segmentPercent,
        };
      }
      accumulatedDistance += segmentLength;
    }

    return points[points.length - 1];
  };

  const [searchQuery, setSearchQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [isLocating, setIsLocating] = useState(false);

  // Get all stations from all lines
  const allStations = useMemo(() => {
    return Object.entries(LINES).flatMap(([lineName, lineData]) => 
      lineData.stations.map(station => ({
        ...station,
        line: lineName as LineName,
        lineColor: lineData.color
      }))
    );
  }, []);

  // Sort stations by distance from current station
  const sortedStations = useMemo(() => {
    if (!selectedStation) return allStations;

    return [...allStations]
      .filter(station => 
        !(station.name === selectedStation.name && 
          station.line === selectedStation.line)
      )
      .sort((a, b) => {
        const lineA = LINES[a.line];
        const lineB = LINES[b.line];
        const pointsA = getAbsolutePoints(lineA.start, lineA.line);
        const pointsB = getAbsolutePoints(lineB.start, lineB.line);
        const currentPoints = getAbsolutePoints(LINES[selectedStation.line].start, LINES[selectedStation.line].line);
        
        const posA = getPointAtDistance(pointsA, a.distance);
        const posB = getPointAtDistance(pointsB, b.distance);
        const currentPos = getPointAtDistance(currentPoints, selectedStation.distance);
        
        const distA = Math.hypot(posA.x - currentPos.x, posA.y - currentPos.y);
        const distB = Math.hypot(posB.x - currentPos.x, posB.y - currentPos.y);
        
        return distA - distB;
      });
  }, [allStations, selectedStation]);

  // Filter stations based on search query
  const filteredStations = useMemo(() => {
    if (!searchQuery) return sortedStations;
    const query = searchQuery.toLowerCase();
    return sortedStations.filter(station => 
      station.name.toLowerCase().includes(query) ||
      station.line.toLowerCase().includes(query)
    );
  }, [sortedStations, searchQuery]);

  // Find nearest station based on lat/lon
  const findNearestStation = (latitude: number, longitude: number): Station | null => {
    const header = stationRankData[0];
    const latIndex = header.indexOf("latitude");
    const lonIndex = header.indexOf("longitude");
    const nameIndex = header.indexOf("standard_name");
    const lineIndex = header.indexOf("line");

    let nearestStation: Station | null = null;
    let minDistance = Infinity;

    stationRankData.slice(1).forEach((stationData) => {
      const stationLat = Number(stationData[latIndex]);
      const stationLon = Number(stationData[lonIndex]);
      const stationName = stationData[nameIndex];
      const stationLine = stationData[lineIndex];

      // Calculate distance using Haversine formula
      const R = 6371; // Earth's radius in km
      const dLat = (stationLat - latitude) * Math.PI / 180;
      const dLon = (stationLon - longitude) * Math.PI / 180;
      const a = 
        Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(latitude * Math.PI / 180) * Math.cos(stationLat * Math.PI / 180) * 
        Math.sin(dLon/2) * Math.sin(dLon/2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
      const distance = R * c;

      if (distance < minDistance) {
        minDistance = distance;
        // Find the matching station in allStations to get the distance property
        const matchingStation = allStations.find(s => 
          s.name === stationName && s.line === stationLine
        );
        if (matchingStation) {
          nearestStation = matchingStation;
        }
      }
    });

    return nearestStation;
  };

  const handleLocationClick = () => {
    setIsLocating(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const nearestStation = findNearestStation(latitude, longitude);
          if (nearestStation) {
            onStationSelect(nearestStation);
            setIsOpen(false);
          }
          setIsLocating(false);
        },
        (error) => {
          console.error("Error getting location:", error);
          setIsLocating(false);
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
      setIsLocating(false);
    }
  };

  // Update parent when station is selected
  const handleStationSelect = (station: Station) => {
    onStationSelect(station);
    setIsOpen(false);
    setSearchQuery(''); // Clear search when selecting a station
  };

  return (
    <div
      className={`flex flex-col ${isMobile ? 'w-full' : 'w-96'} sm:m-4 gap-4 border-1 items-center bg-white/60 backdrop-blur-sm p-4 rounded-lg shadow-lg`}
      style={{ borderColor: lineColor }}
    >
      <div className="relative w-full">
        <div
          onClick={() => {
            setIsOpen(!isOpen);
            if (!isOpen) {
              setSearchQuery(''); // Clear search when opening dropdown
            }
          }}
          className="flex items-center justify-between w-full px-4 py-2 rounded-lg border border-gray-300 bg-white cursor-pointer"
        >
          <div className="flex items-center gap-2">
            {selectedStation ? (
              <>
                <StationIcon color={LINES[selectedStation.line].color} />
                <div>
                  <div className="font-medium">{selectedStation.name}</div>
                  <div className="text-sm text-gray-500">{selectedStation.line}</div>
                </div>
              </>
            ) : (
              <div className="text-gray-500">Select a station</div>
            )}
          </div>
          <ChevronDown className={`w-5 h-5 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </div>
        {isOpen && (
          <div className="absolute z-50 w-full mt-1 bg-white rounded-lg shadow-lg max-h-96 overflow-y-auto">
            <div className="sticky top-0 bg-white p-2 border-b">
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search for a station..."
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 bg-white pr-24"
                />
                <button
                  onClick={handleLocationClick}
                  disabled={isLocating}
                  className={`absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1 px-2 py-1 rounded-md border border-gray-300 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 ${
                    searchQuery ? 'opacity-0 pointer-events-none' : 'opacity-100'
                  }`}
                >
                  <MapPin className="w-3 h-3" />
                  <span className="text-xs">{isLocating ? "Locating..." : "Current Location"}</span>
                </button>
              </div>
            </div>
            {filteredStations.map((station) => (
              <div
                key={`${station.line}-${station.name}`}
                onClick={() => handleStationSelect(station)}
                className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 cursor-pointer"
              >
                <StationIcon color={station.lineColor} />
                <div className="flex-1">
                  <div className="font-medium">{station.name}</div>
                  <div className="text-sm text-gray-500">{station.line}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}; 