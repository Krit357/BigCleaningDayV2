import React from "react";
import { Outlet, useOutletContext } from "react-router-dom";
import employees from "../employee";
import "./Monthly_schedule.css";
import { generateMonthCalendar } from "../utils/calendar";

const Monthly_schedule = () => {
  const { isOpen } = useOutletContext();

  const today = new Date();
  const year = today.getFullYear();
  const monthIndex = today.getMonth() + 2; // zero-based
  const weeks = generateMonthCalendar(year, monthIndex);

  return (
    <div className={`monthly-main-box ${isOpen ? "open" : "close"}`}>
      <div className="monthly-button">
        <button className="schedule_print" onClick={() => window.print()}>
          Print Schedule
        </button>
      </div>
      <div className="monthly-first-box">
        {employees.map((employ, i) => (
          <div className="employ-name" key={i}>
            {/* เปิดชื่อพนง */}
            {/* {employ.name} */}
          </div>
        ))}
      </div>

      <div className="monthly-second-box">
        <div className="calendar">
          {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"].map((d) => (
            <div className="calendar-header" key={d}>
              {d}
            </div>
          ))}

          {weeks.map((week, wi) =>
            // week is an array of 7 slots: [Sun, Mon, Tue, Wed, Thu, Fri, Sat]
            week.slice(1, 6).map((day, di) => {
              const holidays = [2];

              const cellIndex = wi * 5 + di;
              const isHoliday = day != null && holidays.includes(day);
              const employee =
                day && !isHoliday
                  ? employees[cellIndex % employees.length]
                  : null;

              return (
                <div
                  className={
                    `calendar-cell ` +
                    (!day ? "blank" : isHoliday ? "holiday" : "")
                  }
                  key={`${wi}-${di}`}
                >
                  {day && (
                    <>
                      <div className="date">{day}</div>

                      {isHoliday ? (
                        <div className="holiday-text">Holiday</div>
                      ) : (
                        <div className="employ-name">{employee?.name}</div>
                      )}
                    </>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default Monthly_schedule;
