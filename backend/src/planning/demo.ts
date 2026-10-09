import { rankDestinations } from "./rank-destinations.ts";

// Example data for testing, not our final destination dataset.
const destinations = [
  {
    id: "place-a",
    name: "Place A",
    interests: ["nature", "culture"],
  },
  {
    id: "place-b",
    name: "Place B",
    interests: ["nature"],
  },
  {
    id: "place-c",
    name: "Place C",
    interests: ["beach"],
  },
];

// The traveler selects these interests.
const userInterests = [" Nature ", "nature", "culture", ""];

// Run our ranking function.
const results = rankDestinations(destinations, userInterests);

// Display each matching place and its score.
for (const result of results) {
  console.log(`${result.destination.name}: ${result.score}`);
}