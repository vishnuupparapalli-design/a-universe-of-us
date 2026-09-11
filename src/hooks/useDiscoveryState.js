import { useState, useEffect } from 'react';

/**
 * useDiscoveryState — Master Plan Section AD & U
 * 
 * Purpose:
 * The single source of truth for what memories/chapters she has discovered.
 * Stored in browser localStorage under 'elsewhere_discovered_ids'.
 * 
 * Drives:
 * 1. Which constellation stars are lit
 * 2. Which Shelf objects are brightened
 * 3. Subtitle / Easter egg triggers
 */

const STORAGE_KEY = 'elsewhere_discovered_ids';

export function useDiscoveryState() {
  const [discoveredIds, setDiscoveredIds] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      console.warn("Could not read discovery state from localStorage", e);
      return [];
    }
  });

  // Keep localStorage synchronized whenever discoveredIds changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(discoveredIds));
    } catch (e) {
      console.warn("Could not write discovery state to localStorage", e);
    }
  }, [discoveredIds]);

  /**
   * Mark a memory/chapter as discovered
   * @param {string} id - The memory or chapter ID
   */
  const discover = (id) => {
    if (!id) return;
    setDiscoveredIds((prev) => {
      if (prev.includes(id)) return prev; // Already discovered
      return [...prev, id];
    });
  };

  /**
   * Check if a specific ID has been discovered
   * @param {string} id
   * @returns {boolean}
   */
  const isDiscovered = (id) => discoveredIds.includes(id);

  /**
   * Reset all discovery progress (handy for testing or letting her experience it anew)
   */
  const resetDiscovery = () => {
    setDiscoveredIds([]);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (e) {
      // ignore
    }
  };

  return {
    discoveredIds,
    discoveredCount: discoveredIds.length,
    discover,
    isDiscovered,
    resetDiscovery,
  };
}