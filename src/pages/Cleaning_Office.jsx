// src/components/Cleaning_Office.jsx
import React, { useState, useEffect } from "react";
import "./Cleaning_Office.css";

const peoples = [
  "Yok",
  "Ethan",
  "Chris",
  "Day",
  "Mook",
  "Rose",
  "Moss",
  "Bella",
  "Lucus",
  "Sky",
  "Hut",
  "Christian",
  "Min",
];

const initialDuties = {
  foodAndShelfCleaning: {
    task: "ตู้เย็นและที่วางจาน",
    requiredPersons: 3,
    assignedPersons: ["Chris", "Sky", "Rose"],
  },
  dusting: {
    task: "ปัดฝุ่น",
    requiredPersons: 1,
    assignedPersons: ["Hut"],
  },
  sweepFloor: {
    task: "กวาดพื่น",
    requiredPersons: 4,
    assignedPersons: ["Moss", "Yok", "Lucus", "Christian"],
  },
  mopFloor: {
    task: "ถูพื้น",
    requiredPersons: 4,
    assignedPersons: ["Min", "Ethan", "Hut", "Mook"],
  },
  meetingRoom: {
    task: "ห้องประชุม",
    requiredPersons: 1,
    assignedPersons: ["Bella"],
  },
};

function shuffleArray(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function Cleaning_Office() {
  const [duties, setDuties] = useState(() => {
    const saved = localStorage.getItem("cleaningDuties");
    return saved ? JSON.parse(saved) : initialDuties;
  });
  const [lastAssignment, setLastAssignment] = useState(() => {
    const saved = localStorage.getItem("lastAssignment");
    if (saved) return JSON.parse(saved);
    // bootstrap lastAssignment from whatever initial duties are
    return Object.fromEntries(
      Object.entries(initialDuties).map(([k, v]) => [k, v.assignedPersons])
    );
  });

  // Persist on change
  useEffect(() => {
    localStorage.setItem("cleaningDuties", JSON.stringify(duties));
    localStorage.setItem("lastAssignment", JSON.stringify(lastAssignment));
  }, [duties, lastAssignment]);

  const assignDuties = () => {
    // 1) Deep-clone the current duties so we can mutate safely
    const newDuties = JSON.parse(JSON.stringify(duties));

    // 2) Shuffle the full list of people
    let available = shuffleArray(peoples);

    // 3) For each taskKey (including 'sweepFloor'):
    Object.entries(newDuties).forEach(([taskKey, taskObj]) => {
      const { requiredPersons, assignedPersons: prevAssigned } = taskObj;

      // a) Build a forbidden list *from the previous assignment* of THIS task
      const forbidden = prevAssigned; // last time’s people for this task

      // 1) PRIMARY: exclude forbidden entirely
      let pick = available
        .filter((p) => !forbidden.includes(p))
        .slice(0, requiredPersons);

      // 2) FALLBACK: if still short, fill from whatever remains
      //    (we only exclude those we already just picked, not the forbidden list)
      if (pick.length < requiredPersons) {
        const needed = requiredPersons - pick.length;
        const extras = available
          .filter((p) => !pick.includes(p))
          .slice(0, needed);
        pick = pick.concat(extras);
      }

      // commit and remove
      newDuties[taskKey].assignedPersons = pick;
      available = available.filter((p) => !pick.includes(p));
    });

    // 4) Push the update into state (and your useEffect will persist it)
    setDuties(newDuties);
  };

  return (
    <div className="first-cleaning-office">
      <button className="cleaning-office-button" onClick={assignDuties}>
        Assign
      </button>

      <h1 className="cleaning-office">Cleaning Duty Assignment</h1>
      <div className="cleaning-office-board">
        {Object.entries(duties).map(([key, { task, assignedPersons }]) => (
          <div key={key} className="cleaning-office-task">
            <h2 className="cleaning-office-duty">{task}</h2>
            <p className="cleaning-office-letter">
              <span className="cleaning-office-text">
                {assignedPersons.join(", ") || "None"}
              </span>
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
