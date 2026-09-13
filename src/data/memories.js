import { siteSettings, countdownSettings } from './settings';
import { getLiveTimeTogether } from '../utils/countdown';

const liveTime = getLiveTimeTogether(siteSettings.relationshipStartDate, countdownSettings.timezone);
const currentDays = liveTime.days;

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
    // Center Anchor Star
    constellationPosition: { x: 0.50, y: 0.48 },
    linkedStars: ["two-hundred-three-days", "movie-night-01", "our-stories"],
  },
  {
    id: "our-stories",
    chapter: "our-stories",
    title: "Our Stories",
    text: "I learned your story, and you learned mine. Two books resting side by side across the distance.",
    image: null,
    date: null,
    approximateDate: "Getting to know each other",
    location: "Late night calls",
    status: "past",
    // Upper Left
    constellationPosition: { x: 0.35, y: 0.24 },
    linkedStars: ["the-beginning"],
  },
  {
    id: "two-hundred-three-days",
    chapter: `${currentDays}-days`,
    title: `${currentDays} Days`,
    text: `${currentDays} days of choosing each other across the distance.`,
    image: null,
    date: null,
    approximateDate: `${currentDays} Days`,
    location: "New Delhi ↔ Hanoi",
    status: "past",
    // Mid Left
    constellationPosition: { x: 0.22, y: 0.42 },
    linkedStars: ["the-beginning", "hard-days-01"],
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
    // Lower Left
    constellationPosition: { x: 0.16, y: 0.72 },
    linkedStars: ["two-hundred-three-days"],
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
    // Far Upper Right
    constellationPosition: { x: 0.82, y: 0.22 },
    linkedStars: ["movie-night-01", "someday-first-photo"],
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
    status: "future",
    // Lower Right (Reserved place)
    constellationPosition: { x: 0.76, y: 0.74 },
    linkedStars: ["distance-thread"],
  },
];