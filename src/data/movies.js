/**
 * Movie Corner Data — Dispersed so stars never collide!
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
    location: "Dharmavaram ↔ Near Hanoi",
    status: "past",
    // Dispersed Mid-Right (x: 0.68, y: 0.42)
    constellationPosition: { x: 0.68, y: 0.42 },
    linkedStars: ["the-beginning", "distance-thread"],
  },
  {
    id: "midnight-movies",
    chapter: "movie-corner",
    title: "Midnight Movie Nights",
    filmTitle: "Synchronized Streams",
    text: "Keeping each other company with synchronized movies across the 1.5-hour time gap.",
    date: null,
    approximateDate: "Late evenings",
    location: "Across the screens",
    status: "past",
    // Dispersed FAR RIGHT (x: 0.82, y: 0.25) — 320px away from the center star!
    constellationPosition: { x: 0.82, y: 0.25 },
    linkedStars: ["movie-night-01"],
  }
];