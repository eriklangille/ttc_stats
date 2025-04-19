import type { Station } from "../components/map";

export type Incident = {
  year: number;
  date: string;
  time: string;
  description: string;
  minDelay: number;
};

export type StationData = {
  latitude: number;
  longitude: number;
  name: string;
  line: string;
};

// station_ranking_with_latlon.json
// ["danger_rank","standard_name","line","Incident_Count","Average_Danger","Combined_Score","Usage","usage_rank","latitude","longitude"]
// [1,"Bloor-Yonge","Yonge-University",469,2.0511727078891258,235.52558635394456,156643.0,1.0,43.6705465,-79.3856535]
export function getNearestStations(
  latitude: number,
  longitude: number,
  stationData: any
): StationData[] {
  const header = stationData[0];
  const latitudeIndex = header.indexOf("latitude");
  const longitudeIndex = header.indexOf("longitude");
  const nameIndex = header.indexOf("standard_name");
  const lineIndex = header.indexOf("line");

  const stations = stationData.slice(1).map((station: any) => ({
    latitude: station[latitudeIndex],
    longitude: station[longitudeIndex],
    name: station[nameIndex],
    line: station[lineIndex],
  }));

  // Calculate distances and sort by nearest
  const stationsWithDistances = stations.map((station) => {
    const latDiff = station.latitude - latitude;
    const lonDiff = station.longitude - longitude;
    const distance = Math.sqrt(latDiff * latDiff + lonDiff * lonDiff);
    return { ...station, distance };
  });

  return stationsWithDistances
    .sort((a, b) => a.distance - b.distance)
    .map(({ distance, ...station }) => station);
}

// ["danger_rank","standard_name","line","Incident_Count","Average_Danger","Combined_Score","Usage","usage_rank","latitude","longitude"]
// [1,"Bloor-Yonge","Yonge-University",469,2.0511727078891258,235.52558635394456,156643.0,1.0,43.6705465,-79.3856535]
export function getStationRanks(
  station: Station,
  rankData: any
): {
  dangerRank: number;
  usageRank: number;
} {
  const header = rankData[0];
  const stationIndex = header.indexOf("standard_name");
  const lineIndex = header.indexOf("line");
  const dangerRankIndex = header.indexOf("danger_rank");
  const usageRankIndex = header.indexOf("usage_rank");

  const stationRank = rankData.slice(1).find((line) => {
    const stationName = line[stationIndex];
    const lineName = line[lineIndex];
    return stationName === station.name && lineName === station.line;
  });

  if (!stationRank) {
    return {
      dangerRank: 0,
      usageRank: 0,
    };
  }

  return {
    dangerRank: stationRank[dangerRankIndex],
    usageRank: stationRank[usageRankIndex],
  };
}

// ["line","standard_name","Hour","Days_With_Delays","Average_Delay_Minutes","Delay_Likelihood_Percent"]
// ["Yonge-University","Eglinton",5,114,6.209677419354839,14.578005115089516]
export function getStationDelayLikelihood(
  station: Station,
  delayData: any
): { hour: number; likelihood: number }[] {
  const header = delayData[0];
  const lineIndex = header.indexOf("line");
  const stationIndex = header.indexOf("standard_name");
  const hourIndex = header.indexOf("Hour");
  const likelihoodIndex = header.indexOf("Delay_Likelihood_Percent");

  // Create a map of all hours with 0% probability
  const allHours = Array.from({ length: 24 }, (_, i) => ({
    hour: i,
    likelihood: 0,
  }));

  // Update the map with actual data
  delayData
    .slice(1)
    .filter((line) => {
      const stationName = line[stationIndex];
      const lineName = line[lineIndex];
      return stationName === station.name && lineName === station.line;
    })
    .forEach((line) => {
      const hour = line[hourIndex];
      const likelihood = line[likelihoodIndex];
      allHours[hour] = { hour, likelihood };
    });

  return allHours;
}

export function getTopIncidentsForStation(
  station: Station,
  incidents: any,
  numIncidents: number = 10
): Incident[] {
  const header = incidents[0];
  const yearIndex = header.indexOf("Year");
  const stationIndex = header.indexOf("standard_name");
  const lineIndex = header.indexOf("line");
  const dateIndex = header.indexOf("Date");
  const timeIndex = header.indexOf("Time");
  const descriptionIndex = header.indexOf("Description");
  const delayIndex = header.indexOf("Min Delay");

  const stationIncidents = incidents
    .slice(1)
    .map((line) => {
      const stationName = line[stationIndex];
      const lineName = line[lineIndex];
      if (!station || !lineName) return null;

      if (stationName === station.name && lineName === station.line) {
        return {
          year: line[yearIndex],
          date: line[dateIndex],
          time: line[timeIndex],
          description: line[descriptionIndex] ?? "Other",
          minDelay: line[delayIndex],
        };
      }
      return null;
    })
    .filter((incident): incident is Incident => incident !== null)
    .sort((a, b) => b.minDelay - a.minDelay)
    .slice(0, numIncidents);

  return stationIncidents;
}
