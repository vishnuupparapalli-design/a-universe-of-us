/**
 * Timezone & Days Calculations
 */

export function calculateCountdown(targetDateStr, targetTimeStr = "00:00:00", timeZone = "Asia/Ho_Chi_Minh") {
  if (!targetDateStr) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, isCompleted: false };
  }

  try {
    const [year, month, day] = targetDateStr.split('-').map(Number);
    const [hours, minutes, seconds] = targetTimeStr.split(':').map(Number);

    const targetUtc = Date.UTC(year, month - 1, day, hours || 0, minutes || 0, seconds || 0);
    const nowUtc = Date.now();
    const diffMs = targetUtc - nowUtc;

    if (diffMs <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0, isCompleted: true };
    }

    const totalSeconds = Math.floor(diffMs / 1000);
    return {
      days: Math.floor(totalSeconds / (3600 * 24)),
      hours: Math.floor((totalSeconds % (3600 * 24)) / 3600),
      minutes: Math.floor((totalSeconds % 3600) / 60),
      seconds: totalSeconds % 60,
      isCompleted: false,
    };
  } catch (err) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, isCompleted: false };
  }
}

/**
 * Calculates live time elapsed since start date (Feb 22, 2026) in Hanoi time
 */
export function getLiveTimeTogether(startDateStr = "2026-02-22", timeZone = "Asia/Ho_Chi_Minh") {
  try {
    const [sYear, sMonth, sDay] = startDateStr.split('-').map(Number);
    // Start date in Hanoi time (UTC+7)
    const startMs = Date.UTC(sYear, sMonth - 1, sDay, 0, 0, 0) - (7 * 60 * 60 * 1000);
    const nowMs = Date.now();

    const diffMs = Math.max(0, nowMs - startMs);
    const totalSeconds = Math.floor(diffMs / 1000);

    const days = Math.floor(totalSeconds / (3600 * 24));
    const hours = Math.floor((totalSeconds % (3600 * 24)) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return { days, hours, minutes, seconds };
  } catch (e) {
    return { days: 203, hours: 0, minutes: 0, seconds: 0 };
  }
}