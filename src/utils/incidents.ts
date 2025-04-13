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

  console.log(
    stationIndex,
    lineIndex,
    dateIndex,
    timeIndex,
    descriptionIndex,
    delayIndex
  );

  const stationIncidents = incidents
    .slice(1)
    .map((line) => {
      const stationName = line[stationIndex];
      const lineName = line[lineIndex];
      if (!station || !lineName) return null;

      if (stationName === station.name && lineName === station.line) {
        console.log(line);
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
