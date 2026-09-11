/**
 * Timezone-safe Countdown Utility (Master Plan Section F2)
 * Supports both live target dates and graceful "Someday" states.
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
    const days = Math.floor(totalSeconds / (3600 * 24));
    const remHours = Math.floor((totalSeconds % (3600 * 24)) / 3600);
    const remMinutes = Math.floor((totalSeconds % 3600) / 60);
    const remSeconds = Math.floor(totalSeconds % 60);

    return {
      days,
      hours: remHours,
      minutes: remMinutes,
      seconds: remSeconds,
      isCompleted: false,
    };
  } catch (err) {
    console.error("Countdown calculation error:", err);
    return { days: 0, hours: 0, minutes: 0, seconds: 0, isCompleted: false };
  }
}