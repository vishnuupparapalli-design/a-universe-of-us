/**
 * Memories Data Architecture (Master Plan Section AE)
 * 
 * Schema:
 * - id: unique string key
 * - chapter: chapter identifier
 * - title: memory headline
 * - text: personal authored story
 * - image: path in public/photos/ or null (empty frame)
 * - date: YYYY-MM-DD or null
 * - approximateDate: soft label like "early on"
 * - location: symbolic or real location
 * - status: "past" (happened) | "future" (reserved placeholder)
 * - constellationPosition: { x, y } (0.0 to 1.0 normalized coordinates)
 * - linkedStars: array of IDs this star connects to in the sky
 */

export const memories = [
  {
    id: "the-beginning",
    chapter: "the-beginning",
    title: "Where It Started",
    text: "Two people, two screens, one small world between them. The first light that started an entire universe.",
    image: null,
    date: null,
    approximateDate: "The first meeting",
    location: "Genshin Impact",
    status: "past",
    constellationPosition: { x: 0.50, y: 0.50 }, // The anchor star at the center of the sky
    linkedStars: ["two-hundred-one-days", "movie-night-01"],
  },
  {
    id: "two-hundred-one-days",
    chapter: "201-days",
    title: "201 Days",
    text: "201 days of choosing each other across the distance.",
    image: null,
    date: null,
    approximateDate: "201 Days",
    location: "Across the screens",
    status: "past",
    constellationPosition: { x: 0.38, y: 0.42 },
    linkedStars: ["the-beginning", "distance-thread"],
  },
  {
    id: "distance-thread",
    chapter: "across-the-distance",
    title: "Across the Distance",
    text: "Somewhere between here and there, we built a world of our own. The luminous thread connecting two far-apart lights.",
    image: null,
    date: null,
    approximateDate: "Every night",
    location: "Between us",
    status: "past",
    constellationPosition: { x: 0.65, y: 0.35 },
    linkedStars: ["two-hundred-one-days"],
  },
  {
    id: "hard-days-01",
    chapter: "the-hard-days",
    title: "A Quiet Night",
    text: "Some days were heavy and words were hard to find. We stayed on the line anyway, quietly making sure neither of us was alone.",
    image: null,
    date: null,
    approximateDate: "A difficult week",
    location: "In the quiet",
    status: "past",
    constellationPosition: { x: 0.30, y: 0.65 },
    linkedStars: ["the-beginning"],
  },
  {
    id: "someday-first-photo",
    chapter: "someday",
    title: "Our First Photo Together",
    text: "The photo we haven't taken yet. A reserved place in our universe waiting for the day Elsewhere becomes here.",
    image: null,
    date: null,
    approximateDate: "Someday",
    location: "Where we meet",
    status: "future", // Notice: status is "future"! Renders as an empty frame.
    constellationPosition: { x: 0.72, y: 0.68 },
    linkedStars: ["distance-thread"],
  },
];