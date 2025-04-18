import { useState, useEffect } from 'react';
import { LINES } from './map';

type LineName = keyof typeof LINES;
type Station = { distance: number; name: string; line: LineName };

export const StationSelector = ({ onStationSelect, selectedStation, lineColor }: { 
  onStationSelect: (station: Station) => void;
  selectedStation: Station | null;
  lineColor: string;
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

  console.log(lineColor);

  return (
    <div
      className={`flex flex-col sm:flex-row flex-wrap w-full sm:m-4 gap-4 border-1 items-center bg-white/60 backdrop-blur-sm p-4 rounded-lg shadow-lg`}
      style={{ borderColor: lineColor }}>
      <select
        value={selectedLine}
        onChange={(e) => {
          setSelectedLine(e.target.value as LineName);
          // Reset station to first station of the new line
          setSelectedStationName(LINES[e.target.value as LineName].stations[0].name);
        }}
        className="w-full sm:w-auto px-4 py-2 rounded-lg border border-gray-300 bg-white"
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
        className="w-full sm:w-auto px-4 py-2 rounded-lg border border-gray-300 bg-white"
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