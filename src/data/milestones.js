import { siteSettings, countdownSettings } from './settings';
import { getLiveTimeTogether } from '../utils/countdown';

const liveTime = getLiveTimeTogether(siteSettings.relationshipStartDate, countdownSettings.timezone);
const currentDays = liveTime.days;

export const dayMilestones = [
  {
    day: 1,
    title: "Day 1 — The Spark",
    date: "February 22, 2026",
    text: "Two screens lit up in Genshin Impact. We didn't know then that a simple conversation would become an entire universe.",
  },
  {
    day: 50,
    title: "Day 50 — Finding Our Rhythm",
    date: "April 13, 2026",
    text: "Fifty days of late-night texts, adjusting to the 1.5 hour time gap between New Delhi and Hanoi, and learning how easily we could talk about everything.",
  },
  {
    day: 100,
    title: "Day 100 — A Century of Sunsets",
    date: "June 2, 2026",
    text: "One hundred consecutive days of choosing each other across the distance. Distance stopped being scary and started being something we knew we could cross.",
  },
  {
    day: 200,
    title: "Day 200 — Two Hundred Days",
    date: "September 10, 2026",
    text: "Two hundred days of quiet trust. Even on the busiest student days, you were always the first and last person I texted.",
  },
  {
    day: currentDays,
    title: "Today — Choosing You Still",
    date: "Present",
    // Automatically uses the live number (206 today, 207 tomorrow!)
    text: `${currentDays} days together. Every single point of light in this galaxy is one real day we stood by each other.`,
  },
];