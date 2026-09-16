/**
 * Movie Corner Data (Master Plan Section I)
 * Focusing on what it felt like to watch together across two different rooms.
 */

export const movies = [
  {
    id: "movie-night-01",
    chapter: "movie-corner",
    title: "Our First Synchronized Film",
    filmTitle: "First Shared Movie",
    text: "Pressing play at the exact same second across two different rooms. We weren't in the same room, but we watched the exact same light.",
    date: null,
    approximateDate: "Movie Night",
    location: "New Delhi ↔ Hanoi",
    status: "past",
    constellationPosition: { x: 0.64, y: 0.32 },
    linkedStars: ["the-beginning", "distance-thread"],
  },
  {
    id: "midnight-movies",
    chapter: "movie-corner",
    title: "Midnight Movie Nights",
    filmTitle: "Synchronized Streams",
    text: "Keeping each other company with synchronized movies across the 1.5-hour time gap. Pausing at the exact same time when one of us needed water, laughing at the exact same second.",
    date: null,
    approximateDate: "Late evenings",
    location: "Across the screens",
    status: "past",
    constellationPosition: { x: 0.56, y: 0.26 },
    linkedStars: ["movie-night-01"],
  }
];