import "./index.css";
import { useState } from "react";
import Map from "./components/map";
import { StationSelector } from "./components/StationSelector";
import type { Station } from "./components/map";

export function App() {
  const [selectedStation, setSelectedStation] = useState<Station | null>(null);

  return (
    <div className="relative">
      <div className="fixed top-4 left-4 z-50">
        <StationSelector onStationSelect={setSelectedStation} />
      </div>
      <div className="max-w-7xl mx-auto p-8 text-center">
        {/* positive x -> left, positive y -> up */}
        <Map 
          sizeX={1500} 
          scale={3} 
          sizeY={1000} 
          strokeWidth={2} 
          translateX={100} 
          translateY={-100} 
          selectedStation={selectedStation}
          onStationSelect={setSelectedStation}
        />
      </div>

      <h1 className="text-5xl font-bold my-4 leading-tight">TTC Subway Delays</h1>
    </div>
  );
}

export default App;