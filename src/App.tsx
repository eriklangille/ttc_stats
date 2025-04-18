import "./index.css";
import { useState, useEffect } from "react";
import Map from "./components/map";
import { StationSelector } from "./components/StationSelector";
import type { Station } from "./components/map";
import { DraggableCard } from "./components/DraggableCard";
import { MobileStationCard } from "./components/MobileStationCard";
import { LINES } from "./components/map";

type LineName = keyof typeof LINES;

export function App() {
  const [selectedStation, setSelectedStation] = useState<Station | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <div className="relative">
      <div className="fixed top-0 left-0 z-50 w-full sm:w-auto">
        <StationSelector 
          onStationSelect={setSelectedStation} 
          selectedStation={selectedStation}
          lineColor={LINES[selectedStation?.line as LineName ?? "Bloor-Danforth"]?.color}
        />
      </div>
      {selectedStation && (
        isMobile ? (
          <MobileStationCard
            station={selectedStation}
            lineColor={LINES[selectedStation.line as LineName]?.color}
          />
        ) : (
          <DraggableCard
            station={selectedStation}
            lineColor={LINES[selectedStation.line as LineName]?.color}
          />
        )
      )}
      <div className="max-w-7xl mx-auto p-8 text-center">
        <Map 
          sizeX={1500} 
          scale={isMobile ? 2.25 : 3} 
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