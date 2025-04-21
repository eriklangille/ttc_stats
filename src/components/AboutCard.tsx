import { X } from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";
import { cn } from '@/lib/utils';
import { StationDelayChart } from './StationDelayChart';
import { StationIncidentChart } from './StationIncidentChart';
import { StationYearlyDelayChart } from './StationYearlyDelayChart';
import { MonthlyComparisonChart } from './MonthlyComparisonChart';
import { getCombinedAverageDelayLikelihood, getCombinedIncidents, get20192024ComparisonData } from '@/utils/read_data';
import { useState } from 'react';
import monthlyComparisonData from '../ttc-subway-delay-monthly-comparison-2019-2024.json';

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
  const comparisonData = get20192024ComparisonData(monthlyComparisonData, incidentData);
  
  return (
    <div className="text-white space-y-4">
      <p className="text-sm">
        "Take The Car" is a data visualization project created by Erik Langille (<u><a href='https://x.com/eriklangille' target='_blank' rel='noopener noreferrer'>X</a></u>, <u><a href='https://github.com/eriklangille' target='_blank' rel='noopener noreferrer'>GitHub</a></u>) displaying <u><a href='https://open.toronto.ca/dataset/ttc-subway-delay-data/' target='_blank' rel='noopener noreferrer'>TTC subway incident data</a></u> from 2022-2024.
      </p>
      <p className="text-sm">
        After being a frustrated Toronto subway commuter for the past 3 years, I created this project to visualize the TTC's performance. Are the delays getting worse?
      </p>
      <div>
        <h3 className="text-md font-semibold mb-2">Average Delay Likelihood by Hour</h3>
        <StationDelayChart leftMargin={-15} delayLikelihood={combinedDelayLikelihood} lineColor="white" />
      </div>
      <p className="text-sm">
        The first chart shows each station's average delay likelihood for each hour of the day. This calculation is done by taking the percent of the delays in a given hour on a weekday divided by total number of weekdays in the 3 year period. We can observe delay spikes during morning and evening rush hours.
      </p>
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
      <p className="text-sm">
        Each station has a list of the top 30 incidents by delay time for each year - totaling 90 incidents per station from 2022-2024. Aggregated, we can see the majority of incidents involve misbehaving or unwell passengers. Note that I only took incidents that could be easily mapped onto a station. There are some incidents that involve multiple stations or took place in TTC yards. I also didn't count any line 3 data, since it closed in late 2023. Real data is messy.
      </p>
      <div>
        <h3 className="text-md font-semibold">Average Delay by Year</h3>
        <StationYearlyDelayChart incidents={combinedIncidents} lineColor="white" />
      </div>
      <p className="text-sm">
        The average delay by this chart across all stations has gone up slightly over the past 3 years. This is despite TTC's ridership being flat to slightly decreasing comparing <u><a href='https://cdn.ttc.ca/-/media/Project/TTC/DevProto/Documents/Home/Transparency-and-accountability/Subway-Ridership-20232024.pdf?rev=4424b4bf53e443bd85031beab56649b7' target='_blank' rel='noopener noreferrer'>2023-2024 ridership</a></u> to <u><a href='https://pw.ttc.ca/-/media/Project/TTC/DevProto/Documents/Home/Transparency-and-accountability/Subway-Ridership-2022.pdf' target='_blank' rel='noopener noreferrer'>2022</a></u>. And total incident count as well as average delays are way up if you compare 2019 to 2024.
      </p>
      <div>
        <h3 className="text-md font-semibold mb-2">Monthly Incident Comparison - <span className="text-gray-300">2019</span> vs 2024</h3>
        <MonthlyComparisonChart data={comparisonData} />
      </div>
      <p className="text-sm">
        So has the TTC gotten worse in the past 3 years? Yeah, I would say so. But truthfully, it's a story of not recovering since the pandemic. Despite more workplaces now requiring employees to come in, ridership is flat. Service is unreliable.
      </p>
      <p className="text-sm">
        Note: The open source data goes back to 2014, but 2017 is missing October and the pandemic years 2020-2021 are outliers. Therefore I chose to use the past 3 years for all the stations.
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