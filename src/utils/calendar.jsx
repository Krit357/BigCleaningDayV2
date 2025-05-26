export function generateMonthCalendar(year, monthNumber) {
  const monthIndex = monthNumber - 1; // convert to 0–11

  // Day of week of the 1st (0=Sunday … 6=Saturday)
  const firstDayOfWeek = new Date(year, monthIndex, 1).getDay();

  // Number of days in this month:
  // by asking for “day 0” of the *next* month
  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();

  // Build the flat list: leading nulls, then 1…daysInMonth
  const cells = [
    ...Array(firstDayOfWeek).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  // Pad with trailing nulls so total length is a multiple of 7
  while (cells.length % 7 !== 0) {
    cells.push(null);
  }

  // Chunk into weeks
  const weeks = [];
  for (let i = 0; i < cells.length; i += 7) {
    weeks.push(cells.slice(i, i + 7));
  }

  return weeks;
}
