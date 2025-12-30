import React from "react";
import { generateMonthCalendar } from "../utils/calendar";
import employees from "../employee";
import "./Monthly_schedule.css";

const Monthly_schedule = () => {
  // Today's date
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth() + 2; // 1–12

  // Next month (rollover Dec→Jan)
  const nextMonth = month === 12 ? 1 : month + 1;
  const nextYear = month === 12 ? year + 1 : year;

  // Public holidays map: { "YYYY-M": [day, …] }
  const publicHolidays = {
    [`${year}-${month}`]: [1, 2], // sample this month
    [`${nextYear}-${nextMonth}`]: [1, 2], // sample next month
  };

  // Generate both calendars
  const thisWeeks = generateMonthCalendar(year, month);
  const nextWeeks = generateMonthCalendar(nextYear, nextMonth);

  // Count real workdays (Mon–Fri, skipping publicHolidays) in a month
  const calcWorkdays = (weeksArr, key) => {
    const hols = publicHolidays[key] || [];
    return weeksArr.flat().reduce((cnt, day, idx) => {
      if (day == null) return cnt;
      const weekday = idx % 7;
      if (weekday === 0 || weekday === 6) return cnt; // Sun/Sat
      if (hols.includes(day)) return cnt; // public holiday
      return cnt + 1;
    }, 0);
  };

  // This month’s workday count → offset into next month
  const thisKey = `${year}-${month}`;
  const thisOffset = calcWorkdays(thisWeeks, thisKey);

  // Renders a single Mon–Fri calendar block given an initial offset
  const renderCalendar = (weeksArr, m, y, initialOffset) => {
    const key = `${y}-${m}`;
    const hols = publicHolidays[key] || [];
    const monthName = new Date(y, m - 1).toLocaleString("default", {
      month: "long",
    });

    let workdayCount = initialOffset;
    return (
      <div className="calendar-block" key={key}>
        <h3 className="calendar-title">
          {monthName} {y}
        </h3>
        <div className="calendar-grid">
          {/* Mon–Fri headers */}
          {["Mon", "Tue", "Wed", "Thu", "Fri"].map((d) => (
            <div key={d} className="calendar-header">
              {d}
            </div>
          ))}

          {/* 5 weeks × 5 days each */}
          {weeksArr.slice(0, 5).map((week, wi) =>
            week.slice(1, 6).map((day, di) => {
              const isHoliday = day != null && hols.includes(day);
              let empName = "";
              if (day && !isHoliday) {
                empName = employees[workdayCount % employees.length].name;
                workdayCount++;
              }
              return (
                <div
                  key={`${wi}-${di}`}
                  className={
                    "calendar-cell " +
                    (!day ? "blank " : isHoliday ? "holiday" : "")
                  }
                >
                  {day && (
                    <>
                      <div className="date">{day}</div>
                      <div className="employ-name">{empName}</div>
                      {isHoliday && (
                        <div className="holiday-text">Public Holiday</div>
                      )}
                    </>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="monthly-main-box">
      {/* Print button */}
      <div className="monthly-button">
        <button className="schedule_print" onClick={() => window.print()}>
          Print Schedule
        </button>
      </div>

      {/* Two-month calendars */}
      <div className="monthly-calendar-wrapper-box">
        <div className="monthly-calendar-wrapper">
          {renderCalendar(thisWeeks, month, year, 0)}
        </div>
        <div className="monthly-calendar-wrapper-second"></div>
        {renderCalendar(nextWeeks, nextMonth, nextYear, thisOffset)}
      </div>
    </div>
  );
};

export default Monthly_schedule;
