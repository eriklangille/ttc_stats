import type { Station } from "../components/map";

export type Incident = {
  year: number;
  date: string;
  time: string;
  description: string;
  minDelay: number;
};

export function parseStationName(stationName: string): {
  name: string;
  line: string;
} {
  // Handle special cases first
  if (stationName === "SPADINA BD STATION") {
    return { name: "Spadina", line: "Bloor-Danforth" };
  }
  if (stationName === "SPADINA YU STATION") {
    return { name: "Spadina", line: "Yonge-University" };
  }
  if (stationName === "BLOOR-YONGE STATION") {
    return { name: "Bloor-Yonge", line: "Yonge-University" };
  }
  if (stationName === "ST. GEORGE STATION") {
    return { name: "St. George", line: "Yonge-University" };
  }
  if (stationName === "SHEPPARD-YONGE STATION") {
    return { name: "Sheppard-Yonge", line: "Yonge-University" };
  }
  if (stationName === "VAUGHAN MC STATION") {
    return { name: "Vaughan Metropolitan Centre", line: "Yonge-University" };
  }

  // Handle general cases
  const parts = stationName.split(" ");
  const line = parts[parts.length - 1];
  const name = parts.slice(0, -1).join(" ").replace(" STATION", "");

  return {
    name,
    line:
      line === "BD"
        ? "Bloor-Danforth"
        : line === "YU"
        ? "Yonge-University"
        : line === "SHP"
        ? "Sheppard"
        : line,
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
  incidents: any
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
    .slice(0, 10);

  return stationIncidents;
}
