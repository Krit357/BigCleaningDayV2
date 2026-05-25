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
  "Fah",
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
    assignedPersons: ["Christian", "Fah", "Hut"],
  },
  dusting: {
    task: "ปัดฝุ่น",
    requiredPersons: 1,
    assignedPersons: ["Chris"],
  },
  sweepFloor: {
    task: "กวาดพื้น",
    requiredPersons: 4,
    assignedPersons: ["Day", "Rose", "Ethan", "Sky"],
  },
  mopFloor: {
    task: "ถูพื้น",
    requiredPersons: 4,
    assignedPersons: ["Yok", "Lucus", "Moss", "Min"],
  },
  meetingRoom: {
    task: "ห้องประชุม",
    requiredPersons: 1,
    assignedPersons: ["Mook"],
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

  useEffect(() => {
    localStorage.setItem("cleaningDuties", JSON.stringify(duties));
  }, [duties]);

  const assignDuties = () => {
    let attempts = 0;
    let success = false;
    let newDuties = null;

    while (!success && attempts < 1000) {
      attempts++;

      const tempDuties = JSON.parse(JSON.stringify(duties));
      let availablePeople = shuffleArray(peoples);
      success = true;

      for (const [taskKey, taskObj] of Object.entries(tempDuties)) {
        const { requiredPersons } = taskObj;

        // คนที่อยู่หน้าที่นี้ในรอบก่อน ห้ามอยู่หน้าที่เดิมซ้ำ
        const previousPeopleInThisTask = duties[taskKey].assignedPersons;

        const selectedPeople = availablePeople
          .filter((person) => !previousPeopleInThisTask.includes(person))
          .slice(0, requiredPersons);

        // ถ้าเลือกคนไม่พอ แปลว่ารอบนี้ใช้ไม่ได้ ต้องสุ่มใหม่
        if (selectedPeople.length < requiredPersons) {
          success = false;
          break;
        }

        tempDuties[taskKey].assignedPersons = selectedPeople;

        // เอาคนที่ถูกเลือกแล้วออก เพื่อไม่ให้ไปซ้ำหน้าที่อื่น
        availablePeople = availablePeople.filter(
          (person) => !selectedPeople.includes(person),
        );
      }

      if (success) {
        newDuties = tempDuties;
      }
    }

    if (!success) {
      alert("ไม่สามารถสุ่มโดยไม่ซ้ำหน้าที่เดิมได้ กรุณาลองใหม่");
      return;
    }

    setDuties(newDuties);
  };

  const resetDuties = () => {
    localStorage.removeItem("cleaningDuties");
    const freshInitialDuties = JSON.parse(JSON.stringify(initialDuties));
    setDuties(freshInitialDuties);
  };

  return (
    <div className="first-cleaning-office">
      <div className="cleaning-button">
        <button className="cleaning-office-button" onClick={assignDuties}>
          Assign
        </button>

        <button className="cleaning-office-button" onClick={resetDuties}>
          Reset
        </button>
      </div>

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
