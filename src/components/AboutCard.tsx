import { X } from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";

type AboutCardProps = {
  isMobile: boolean;
  onClose: () => void;
  lineColor: string;
};

export const AboutCard = ({ isMobile, onClose, lineColor }: AboutCardProps) => {
  if (isMobile) {
    return (
      <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm">
        <div className="h-full w-full flex flex-col">
          <div className="flex-none">
            <div className="w-full h-10 flex justify-between items-center px-4 bg-black">
              <h2 className="text-lg font-semibold text-white">About TTC Stats</h2>
              <button 
                onClick={onClose}
                className="p-2 hover:bg-white/10 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-white" />
              </button>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-4">
            <div className="text-white space-y-4">
              <p>
                TTC Stats is a data visualization tool that provides insights into the Toronto Transit Commission's subway system.
                This application allows users to explore station-specific data including delay likelihood, incident history, and usage statistics.
              </p>
              <p>
                The data presented in this application is collected from various TTC sources and is updated periodically.
                All visualizations and rankings are based on historical data and are intended to provide general insights into station performance.
              </p>
              <p>
                This is a placeholder description. More detailed information about the data sources and methodology will be added here.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Card className="rounded-lg w-96 shadow-none border-0 bg-black/60 backdrop-blur-sm flex flex-col" style={{ borderColor: lineColor }}>
      <div className="flex-none">
        <div className="w-full h-10 flex justify-between items-center px-4 bg-black/80 rounded-t-lg">
          <h2 className="text-lg font-semibold text-white">About TTC Stats</h2>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-white" />
          </button>
        </div>
      </div>
      <CardContent className="p-4">
        <div className="text-white space-y-4">
          <p>
            TTC Stats is a data visualization tool that provides insights into the Toronto Transit Commission's subway system.
            This application allows users to explore station-specific data including delay likelihood, incident history, and usage statistics.
          </p>
          <p>
            The data presented in this application is collected from various TTC sources and is updated periodically.
            All visualizations and rankings are based on historical data and are intended to provide general insights into station performance.
          </p>
          <p>
            This is a placeholder description. More detailed information about the data sources and methodology will be added here.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}; 