import "./index.css";
import { useState } from "react";
import Map from "./components/map";
import { StationSelector } from "./components/StationSelector";
import type { Station } from "./components/map";
import { StationCard } from "./components/StationCard";
import { LINES } from "./components/map";

type LineName = keyof typeof LINES;

export function App() {
  const [selectedStation, setSelectedStation] = useState<Station | null>(null);

  return (
    <div className="relative">
      <div className="fixed top-0 left-0 z-50">
        <StationSelector 
          onStationSelect={setSelectedStation} 
          selectedStation={selectedStation}
        />
        <StationCard
          station={selectedStation}
          onClose={() => setSelectedStation(null)}
          lineColor={LINES[selectedStation?.line as LineName]?.color}
        />
      </div>
      <div className="max-w-7xl mx-auto p-8 text-center">
        <Map 
          sizeX={1500} 
          scale={3} 
          sizeY={1000} 
          strokeWidth={2} 
          selectedStation={selectedStation}
          onStationSelect={setSelectedStation}
        />
      </div>

      {/* <h1 className="text-5xl font-bold my-4 leading-tight">TTC Subway Delays</h1> */}
    </div>
  );
}

export default App;