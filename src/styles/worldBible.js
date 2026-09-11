/**
 * ELSEWHERE — WORLD BIBLE (Design System & Atmosphere Reference)
 * Based on Master Plan V2: Section B, T, and Y.
 * 
 * Guiding Metaphor:
 * "One meeting became a memory. Memories became stars. Stars became a little universe."
 * 
 * Architecture Principle:
 * "One world, not many pages" — Dioramas must feel like rooms in the same house.
 */

export const WORLD_BIBLE = {
  // 1. Material Language: Claymorphic & Handcrafted
  materials: {
    philosophy: "Matte rounded primitives, soft ceramic feel, zero harsh low-poly corners.",
    roughness: 0.75,         // High roughness for clay/chalk finish
    metalness: 0.05,         // Minimal metalness
    clearcoat: 0.1,          // Very subtle wax sheen
    colorBase: "#1a233a",    // Soft midnight ceramic
  },

  // 2. Lighting Philosophy: Warm Key + Cool Ambient Fill
  lighting: {
    ambientFill: "#0c1222",   // Cool ambient night fill
    keyLightColor: "#fff4e0", // Warm soft key light (desk lamp / starlight feel)
    keyLightIntensity: 1.2,
    shadowSoftness: "High, diffused contact shadows",
  },

  // 3. Particle System: Re-tuned per chapter, never a completely different effect
  particles: {
    style: "Soft drifting motes / dust in a shaft of light",
    speed: "Slow, floaty, contemplative (0.002 - 0.005 velocity)",
  },

  // 4. Chapter Atmosphere Table (Section T of Master Plan)
  atmospheres: {
    beginning: {
      name: "The Beginning",
      ambient: "#1e1b4b",     // Cool violet-blue
      accent: "#a5b4fc",
      particles: "Dense drifting star motes",
      audioCue: "Soft chime",
      headline: "Two people, two screens, one small world between them.",
    },
    movieCorner: {
      name: "Movie Corner",
      ambient: "#1c140a",     // Warm, dim projector room
      accent: "#fcd34d",
      particles: "Slow dust motes in light beam",
      audioCue: "Faint projector hum",
      headline: "We weren't in the same room. We still watched the same light.",
    },
    ourStories: {
      name: "Our Stories",
      ambient: "#1f1610",     // Warm desk-brown
      accent: "#d97706",
      particles: "Drifting paper-scrap motes",
      audioCue: "Soft page-turn",
      headline: "I learned your story, and you learned mine.",
    },
    hardDays: {
      name: "The Hard Days",
      ambient: "#080a0f",     // Near-black, deeply restrained
      accent: "#64748b",
      particles: "None",
      audioCue: "Silence",
      headline: "Some days were quiet. We stayed anyway.",
    },
    twoHundredOneDays: {
      name: "201 Days",
      ambient: "#1c1912",     // Cream-gold
      accent: "#dfb76c",      // Reserved muted gold
      particles: "Dense, slow point-cloud drift",
      audioCue: "Very soft ambient hum",
      headline: "201 days of choosing each other.",
    },
    distance: {
      name: "Across the Distance",
      ambient: "#091124",     // Deep space navy
      accent: "#38bdf8",      // Luminous thread cyan
      particles: "Sparse, slow connection motes",
      audioCue: "Faint low tone",
      headline: "Somewhere between here and there, we built a world of our own.",
    },
    someday: {
      name: "Someday",
      ambient: "#1a1215",     // Dawn peach / rose
      accent: "#fda4af",
      particles: "Very sparse morning dust",
      audioCue: "Quiet breeze",
      headline: "The photos and places we haven't experienced yet.",
    },
    skyBetweenUs: {
      name: "The Sky Between Us",
      ambient: "#050811",     // Deepest night-blue
      accent: "#ffffff",
      particles: "Full constellation particle field",
      audioCue: "Soft layered mix of every chime",
      headline: "One story became one universe.",
    }
  }
};