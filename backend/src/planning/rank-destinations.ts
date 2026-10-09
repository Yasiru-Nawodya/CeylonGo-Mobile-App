
//This code helps CeylonGo choose places that
//  match what the traveler likes.

//Define destination data
//An interface describes the structure an object must 
// follow:

// Describe the information stored for each destination.
export interface Destination {
  id: string;   // Unique identifier, such as "sigiriya".

  name: string; // Display name.
  interests: string[];  // Tags, such as ["nature", "culture"].
}

//Define the ranking result

// Describe the result produced for each matching destination.

export interface RankedDestination {
  destination: Destination;
  matchedInterests: string[];
  score: number;
}

//Each result includes the original destination, 
// its matching interests, and its score:

// Receive destinations and traveler interests, 
// then return ranked results.

export function rankDestinations(
  destinations: Destination[],
  userInterests: string[],
): RankedDestination[] {

      // Remove surrounding spaces and lowercase 
      // text to make matching consistent.
  const normalize = (value: string) => value.trim().toLowerCase();

  // Clean the traveler's interests and remove empty values and duplicates.

  const preferences = new Set(
    userInterests.map(normalize).filter(Boolean),
  );

    // Without interests, there is nothing to match.

  if (preferences.size === 0) {
    return [];
  }

  return destinations
 // Calculate a result for every destination.

    .map((destination): RankedDestination => {
// Clean the destination's interest tags and remove duplicates.
      const tags = new Set(destination.interests.map(normalize));
 // Keep only traveler interests that this destination also has.
      const matchedInterests = [...preferences].filter(
        (interest) => tags.has(interest),
      );

      // Return the destination, its matches, and its calculated score.
      return {
        destination,
        matchedInterests,
        score: matchedInterests.length / preferences.size,
      };
    })
    // Exclude destinations that match none of the selected interests.
    .filter((result) => result.score > 0)
    
    
    // Put higher scores first; use destination ID to break ties.
    .sort(
      (a, b) =>
        b.score - a.score ||
        a.destination.id.localeCompare(b.destination.id),
    );
}