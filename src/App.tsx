import "./index.css";
import { useState, useEffect } from "react";
import Map from "./components/map";
import { StationSelector } from "./components/StationSelector";
import type { Station } from "./components/map";
import { DraggableCard } from "./components/DraggableCard";
import { MobileStationCard } from "./components/MobileStationCard";
import { DraggableAboutCard } from "./components/DraggableAboutCard";
import { LINES } from "./components/map";

type LineName = keyof typeof LINES;

export function App() {
  const [selectedStation, setSelectedStation] = useState<Station>({
    name: "Bloor-Yonge",
    line: "Yonge-University",
    distance: 361
  });
  const [isMobile, setIsMobile] = useState(false);
  const [showAbout, setShowAbout] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <div className="h-full w-full relative">
      <div className="fixed top-0 left-0 z-50 w-full sm:w-auto">
        <StationSelector 
          onStationSelect={setSelectedStation} 
          selectedStation={selectedStation}
          lineColor={LINES[selectedStation?.line as LineName ?? "Bloor-Danforth"]?.color}
          isMobile={isMobile}
          onAboutClick={() => setShowAbout(true)}
        />
      </div>
      {selectedStation && (
        isMobile ? (
          <MobileStationCard
            station={selectedStation}
            lineColor={LINES[selectedStation.line as LineName]?.color}
            isMobile={isMobile}
          />
        ) : (
          <DraggableCard
            station={selectedStation}
            lineColor={LINES[selectedStation.line as LineName]?.color}
            isMobile={isMobile}
          />
        )
      )}
      {showAbout && (
        <DraggableAboutCard
          isMobile={isMobile}
          onClose={() => setShowAbout(false)}
          lineColor={LINES[selectedStation?.line as LineName ?? "Bloor-Danforth"]?.color}
        />
      )}
      <div className="h-full w-full">
        <Map 
          sizeX={1500} 
          scale={isMobile ? 2.75 : 3} 
          sizeY={1000} 
          strokeWidth={2} 
          selectedStation={selectedStation}
          onStationSelect={setSelectedStation}
          isMobile={isMobile}
        />
      </div>
    </div>
  );
}

export default App;