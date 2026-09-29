import React, { useEffect, useState } from "react";
import { generateMonthCalendar } from "../utils/calendar";
import employees from "../employee";
import "./Monthly_schedule.css";

const Monthly_schedule = () => {
  const today = new Date();

  // แสดงเดือนหน้าและเดือนถัดไป
  const firstDate = new Date(today.getFullYear(), today.getMonth() + 1, 1);
  const secondDate = new Date(today.getFullYear(), today.getMonth() + 2, 1);

  const year = firstDate.getFullYear();
  const month = firstDate.getMonth() + 1;
  const nextYear = secondDate.getFullYear();
  const nextMonth = secondDate.getMonth() + 1;

  const [holidays, setHolidays] = useState(() => {
    const saved = localStorage.getItem("scheduleHolidays");
    return saved ? JSON.parse(saved) : [];
  });

  const firstMonthDate = `${year}-${String(month).padStart(2, "0")}-01`;
  const [selectedDate, setSelectedDate] = useState(firstMonthDate);

  useEffect(() => {
    localStorage.setItem("scheduleHolidays", JSON.stringify(holidays));
  }, [holidays]);

  const dateKey = (y, m, day) =>
    `${y}-${String(m).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

  const addHoliday = () => {
    if (!selectedDate || holidays.includes(selectedDate)) return;
    setHolidays([...holidays, selectedDate]);
    setSelectedDate(firstMonthDate);
  };

  const removeHoliday = (date) => {
    setHolidays(holidays.filter((holiday) => holiday !== date));
  };

  const thisWeeks = generateMonthCalendar(year, month);
  const nextWeeks = generateMonthCalendar(nextYear, nextMonth);

  const calcWorkdays = (weeksArr, y, m) => {
    return weeksArr.flat().reduce((count, day, index) => {
      if (day == null) return count;

      const weekday = index % 7; // 0 = Sun, 6 = Sat
      if (weekday === 0 || weekday === 6) return count;
      if (holidays.includes(dateKey(y, m, day))) return count;

      return count + 1;
    }, 0);
  };

  const thisOffset = calcWorkdays(thisWeeks, year, month);

  const renderCalendar = (weeksArr, m, y, initialOffset) => {
    const monthName = new Date(y, m - 1).toLocaleString("default", {
      month: "long",
    });

    let workdayCount = initialOffset;

    return (
      <div className="calendar-block" key={`${y}-${m}`}>
        <h3 className="calendar-title">
          {monthName} {y}
        </h3>

        <div className="calendar-grid">
          {["Mon", "Tue", "Wed", "Thu", "Fri"].map((d) => (
            <div key={d} className="calendar-header">
              {d}
            </div>
          ))}

          {weeksArr.map((week, wi) =>
            week.slice(1, 6).map((day, di) => {
              const isHoliday =
                day != null && holidays.includes(dateKey(y, m, day));

              let empName = "";
              if (day != null && !isHoliday && employees.length > 0) {
                empName = employees[workdayCount % employees.length].name;
                workdayCount++;
              }

              return (
                <div
                  key={`${wi}-${di}`}
                  className={
                    "calendar-cell " +
                    (day == null ? "blank" : isHoliday ? "holiday" : "")
                  }
                >
                  {day != null && (
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
            }),
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="monthly-main-box">
      <div className="monthly-button">
        <button className="schedule_print" onClick={() => window.print()}>
          Print Schedule
        </button>
      </div>

      <div className="holiday-form">
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
        />
        <button onClick={addHoliday}>Add Holiday</button>

        {holidays
          .filter(
            (date) =>
              date.startsWith(`${year}-${String(month).padStart(2, "0")}-`) ||
              date.startsWith(
                `${nextYear}-${String(nextMonth).padStart(2, "0")}-`,
              ),
          )
          .sort()
          .map((date) => (
            <span key={date}>
              {date} <button onClick={() => removeHoliday(date)}>×</button>
            </span>
          ))}
      </div>

      <div className="monthly-calendar-wrapper-box">
        <div className="monthly-calendar-wrapper">
          {renderCalendar(thisWeeks, month, year, 0)}
        </div>
        <div className="monthly-calendar-wrapper-second"></div>
      </div>
    </div>
  );
};

export default Monthly_schedule;
