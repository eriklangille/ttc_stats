import { useState, useEffect } from 'react';
import { LINES } from './map';

type LineName = keyof typeof LINES;
type Station = { distance: number; name: string };

export const StationSelector = ({ onStationSelect }: { onStationSelect: (station: Station) => void }) => {
  const [selectedLine, setSelectedLine] = useState<LineName>('Yonge-University');
  const [selectedStation, setSelectedStation] = useState<string>('Sheppard-Yonge');

  useEffect(() => {
    const station = LINES[selectedLine].stations.find(s => s.name === selectedStation);
    if (station) {
      onStationSelect(station);
    }
  }, [selectedLine, selectedStation, onStationSelect]);

  return (
    <div className="flex gap-4 items-center bg-white/90 backdrop-blur-sm p-4 rounded-lg shadow-lg">
      <select
        value={selectedLine}
        onChange={(e) => {
          setSelectedLine(e.target.value as LineName);
          // Reset station to first station of the new line
          setSelectedStation(LINES[e.target.value as LineName].stations[0].name);
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
        value={selectedStation}
        onChange={(e) => setSelectedStation(e.target.value)}
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