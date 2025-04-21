import { X } from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";
import { cn } from '@/lib/utils';
import { StationDelayChart } from './StationDelayChart';
import { StationIncidentChart } from './StationIncidentChart';
import { StationYearlyDelayChart } from './StationYearlyDelayChart';
import { getCombinedAverageDelayLikelihood, getCombinedIncidents } from '@/utils/read_data';
import { useState } from 'react';

type AboutCardProps = {
  isMobile: boolean;
  onClose: () => void;
  lineColor: string;
  onTouchStart?: (e: React.TouchEvent) => void;
  onTouchMove?: (e: React.TouchEvent) => void;
  onTouchEnd?: () => void;
  onMouseDown?: (e: React.MouseEvent) => void;
  delayData: any;
  incidentData: any;
};

const AboutContent = ({ delayData, incidentData }: { delayData: any; incidentData: any }) => {
  const [selectedYear, setSelectedYear] = useState<number | 'all'>('all');
  const combinedDelayLikelihood = getCombinedAverageDelayLikelihood(delayData);
  const combinedIncidents = getCombinedIncidents(incidentData);
  const filteredIncidents = selectedYear === 'all' 
    ? combinedIncidents 
    : combinedIncidents.filter(incident => incident.year === selectedYear);
  
  return (
    <div className="text-white space-y-4">
      <p>
        TTC Stats is a data visualization tool that provides insights into the Toronto Transit Commission's subway system.
        This application allows users to explore station-specific data including delay likelihood, incident history, and usage statistics.
      </p>
      <div>
        <h3 className="text-md font-semibold mb-2">Average Delay Likelihood by Hour</h3>
        <StationDelayChart leftMargin={-15} delayLikelihood={combinedDelayLikelihood} lineColor="white" />
      </div>
      <div>
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-md font-semibold">Top Delay Incident Types</h3>
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value === 'all' ? 'all' : Number(e.target.value))}
            className="bg-black/60 text-white border border-white/20 rounded px-2 py-1 text-sm"
          >
            <option value="all">All Years</option>
            <option value={2022}>2022</option>
            <option value={2023}>2023</option>
            <option value={2024}>2024</option>
          </select>
        </div>
        <StationIncidentChart leftMargin={60} incidents={filteredIncidents} topIncidentCount={8} lineColor="#ffffff" />
      </div>
      <div>
        <h3 className="text-md font-semibold">Average Delay by Year</h3>
        <StationYearlyDelayChart incidents={combinedIncidents} lineColor="white" />
      </div>
      <p>
        The data presented in this application is collected from various TTC sources and is updated periodically.
        All visualizations and rankings are based on historical data and are intended to provide general insights into station performance.
      </p>
      <p>
        This is a placeholder description. More detailed information about the data sources and methodology will be added here.
      </p>
    </div>
  );
};

const Header = ({ onClose, isMobile }: { onClose: () => void; isMobile: boolean }) => (
  <div className={cn("w-full h-13 flex justify-between items-center px-4 bg-black", isMobile && "mt-4")}>
    <h2 className="text-lg font-semibold text-white">About</h2>
    {isMobile && (
      <button 
        onClick={onClose}
        className="p-2 hover:bg-white/10 rounded-full transition-colors"
      >
        <X className="w-5 h-5 text-white" />
      </button>
    )}
  </div>
);

export const AboutCard = ({ 
  isMobile, 
  onClose, 
  lineColor,
  onTouchStart,
  onTouchMove,
  onTouchEnd,
  onMouseDown,
  delayData,
  incidentData
}: AboutCardProps) => {
  if (isMobile) {
    return (
      <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm">
        <div className="h-full w-full flex flex-col">
          <div className="flex-none">
            <Header onClose={onClose} isMobile={isMobile} />
          </div>
          <div className="flex-1 overflow-y-auto p-4">
            <AboutContent delayData={delayData} incidentData={incidentData} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <Card className="rounded-lg w-96 shadow-none border-0 bg-black/60 backdrop-blur-sm flex flex-col max-h-[80vh]" style={{ borderColor: lineColor }}>
      <div className="flex-none">
        <div 
          className="w-full h-10 flex justify-center items-center touch-none cursor-move bg-black rounded-t-lg"
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
          onMouseDown={onMouseDown}
        >
          <div className="w-12 h-1.5 bg-gray-200 rounded-full" />
        </div>
        <Header onClose={onClose} isMobile={isMobile} />
      </div>
      <CardContent className="p-4 overflow-y-auto">
        <AboutContent delayData={delayData} incidentData={incidentData} />
      </CardContent>
    </Card>
  );
}; 