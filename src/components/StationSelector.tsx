import { useState, useEffect } from 'react';
import { LINES } from './map';

type LineName = keyof typeof LINES;
type Station = { distance: number; name: string; line: LineName };

export const StationSelector = ({ onStationSelect, selectedStation }: { 
  onStationSelect: (station: Station) => void;
  selectedStation: Station | null;
}) => {
  const [selectedLine, setSelectedLine] = useState<LineName>('Yonge-University');
  const [selectedStationName, setSelectedStationName] = useState<string>('Sheppard-Yonge');

  // Update selector state when station is selected from map
  useEffect(() => {
    if (selectedStation) {
      setSelectedLine(selectedStation.line);
      setSelectedStationName(selectedStation.name);
    }
  }, [selectedStation]);

  // Update parent when selector changes
  useEffect(() => {
    const station = LINES[selectedLine].stations.find(s => s.name === selectedStationName);
    if (station) {
      onStationSelect(station);
    }
  }, [selectedLine, selectedStationName, onStationSelect]);

  return (
    <div className="flex flex-wrap m-4 gap-4 items-center bg-white/90 backdrop-blur-sm p-4 rounded-lg shadow-lg">
      <select
        value={selectedLine}
        onChange={(e) => {
          setSelectedLine(e.target.value as LineName);
          // Reset station to first station of the new line
          setSelectedStationName(LINES[e.target.value as LineName].stations[0].name);
        }}
        className="px-4 py-2 rounded-lg border border-gray-300 bg-white min-w-[200px]"
      >
        {Object.keys(LINES).map((line) => (
          <option key={line} value={line}>
            {line}
          </option>
        ))}
      </select>

      <select
        value={selectedStationName}
        onChange={(e) => setSelectedStationName(e.target.value)}
        className="px-4 py-2 rounded-lg border border-gray-300 bg-white min-w-[200px]"
      >
        {LINES[selectedLine].stations.map((station) => (
          <option key={station.name} value={station.name}>
            {station.name}
          </option>
        ))}
      </select>
    </div>
  );
}; 