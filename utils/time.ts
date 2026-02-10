
/**
 * Converts HH:mm string to minutes from start of day.
 * If handleMidnight is true and time is "00:00", it returns 1440 (end of day).
 */
export const timeToMinutes = (time: string, handleMidnight: boolean = false): number => {
  const [h, m] = time.split(':').map(Number);
  if (handleMidnight && h === 0 && m === 0) return 1440;
  return h * 60 + m;
};

/**
 * Adds minutes to a time string in HH:mm format.
 */
export const addMinutes = (time: string, minutes: number): string => {
  const mins = timeToMinutes(time) + minutes;
  const h = Math.floor((mins / 60) % 24).toString().padStart(2, '0');
  const m = (mins % 60).toString().padStart(2, '0');
  return `${h}:${m}`;
};

/**
 * Subtracts minutes from a time string in HH:mm format.
 */
export const subtractMinutes = (time: string, minutes: number): string => {
  return addMinutes(time, -minutes);
};

/**
 * Calculates duration in minutes between two HH:mm strings.
 */
export const getDuration = (start: string, end: string): number => {
  const startMins = timeToMinutes(start);
  let endMins = timeToMinutes(end, true);
  return endMins - startMins;
};

/**
 * Compares two HH:mm strings. Returns negative if a < b.
 */
export const compareTimes = (a: string, b: string): number => {
  return timeToMinutes(a) - timeToMinutes(b);
};

/**
 * Checks if the provided date string contains today's date or current day name.
 */
export const isDateToday = (dateStr: string): boolean => {
  if (!dateStr) return false;
  const today = new Date();
  
  // Check DD.MM format
  const d = today.getDate().toString().padStart(2, '0');
  const m = (today.getMonth() + 1).toString().padStart(2, '0');
  const pattern = `${d}.${m}`;
  if (dateStr.includes(pattern)) return true;

  // Check Slovak Day Names
  const daysSk = ['Nedeľa', 'Pondelok', 'Utorok', 'Streda', 'Štvrtok', 'Piatok', 'Sobota'];
  const currentDayName = daysSk[today.getDay()];
  return dateStr.toLowerCase().includes(currentDayName.toLowerCase());
};

/**
 * Calculates remaining seconds until a specific HH:mm time.
 */
export const getRemainingSeconds = (endTimeStr: string): number => {
  const now = new Date();
  const currentTotalSeconds = now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds();
  
  let [h, m] = endTimeStr.split(':').map(Number);
  let targetTotalSeconds = h * 3600 + m * 60;
  
  if (h === 0 && m === 0) targetTotalSeconds = 24 * 3600;
  
  const diff = targetTotalSeconds - currentTotalSeconds;
  return Math.max(0, diff);
};

/**
 * Formats seconds into MM:SS.
 */
export const formatRemainingTime = (totalSeconds: number): string => {
  const mins = Math.floor(totalSeconds / 60);
  const secs = totalSeconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};
