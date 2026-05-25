// src/components/Cleaning_Office.jsx
import React, { useState, useEffect } from "react";
import "./Cleaning_Office.css";

const defaultPeoples = [
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
    assignedPersons: ["Chris", "Sky", "Rose"],
  },
  dusting: {
    task: "ปัดฝุ่น",
    requiredPersons: 1,
    assignedPersons: ["Day"],
  },
  sweepFloor: {
    task: "กวาดพื้น",
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
    assignedPersons: ["Fah"],
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
  const [peopleList, setPeopleList] = useState(() => {
    const saved = localStorage.getItem("peopleList");
    return saved ? JSON.parse(saved) : defaultPeoples;
  });

  const [newPersonName, setNewPersonName] = useState("");

  const [duties, setDuties] = useState(() => {
    const saved = localStorage.getItem("cleaningDuties");
    return saved ? JSON.parse(saved) : initialDuties;
  });

  useEffect(() => {
    localStorage.setItem("peopleList", JSON.stringify(peopleList));
  }, [peopleList]);

  useEffect(() => {
    localStorage.setItem("cleaningDuties", JSON.stringify(duties));
  }, [duties]);

  const addPerson = () => {
    const name = newPersonName.trim();

    if (!name) {
      alert("กรุณาใส่ชื่อ");
      return;
    }

    if (peopleList.includes(name)) {
      alert("มีชื่อนี้อยู่แล้ว");
      return;
    }

    setPeopleList([...peopleList, name]);
    setNewPersonName("");
  };

  const removePerson = (name) => {
    const isAssigned = Object.values(duties).some((duty) =>
      duty.assignedPersons.includes(name),
    );

    if (isAssigned) {
      alert("ไม่สามารถลบได้ เพราะชื่อนี้ถูก assign อยู่ในหน้าที่ปัจจุบัน");
      return;
    }

    setPeopleList(peopleList.filter((person) => person !== name));
  };

  const assignDuties = () => {
    const totalRequiredPersons = Object.values(duties).reduce(
      (total, duty) => total + duty.requiredPersons,
      0,
    );

    if (peopleList.length < totalRequiredPersons) {
      alert("จำนวนคนไม่พอกับจำนวนหน้าที่ทั้งหมด");
      return;
    }

    let attempts = 0;
    let success = false;
    let newDuties = null;

    while (!success && attempts < 1000) {
      attempts++;

      const tempDuties = JSON.parse(JSON.stringify(duties));
      let availablePeople = shuffleArray(peopleList);
      success = true;

      for (const [taskKey, taskObj] of Object.entries(tempDuties)) {
        const { requiredPersons } = taskObj;

        const previousPeopleInThisTask = duties[taskKey].assignedPersons;

        const selectedPeople = availablePeople
          .filter((person) => !previousPeopleInThisTask.includes(person))
          .slice(0, requiredPersons);

        if (selectedPeople.length < requiredPersons) {
          success = false;
          break;
        }

        tempDuties[taskKey].assignedPersons = selectedPeople;

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

  const resetPeople = () => {
    localStorage.removeItem("peopleList");
    setPeopleList(defaultPeoples);
  };

  return (
    <div className="first-cleaning-office">
      <h2 className="cleaning-office">Cleaning Duty Assignment</h2>
      <div className="cleaning-office-button-box">
        <button className="cleaning-office-button" onClick={assignDuties}>
          Assign
        </button>

        <button className="cleaning-office-button" onClick={resetDuties}>
          Reset Duties
        </button>

        <button className="cleaning-office-button" onClick={resetPeople}>
          Reset People
        </button>
      </div>

      <div className="cleaning-office-form">
        <input
          type="text"
          value={newPersonName}
          placeholder="ใส่ชื่อคน"
          onChange={(e) => setNewPersonName(e.target.value)}
        />

        <button onClick={addPerson}>Add Person</button>
      </div>

      <div className="cleaning-office-people-list">
        {peopleList.map((person) => (
          <span key={person} className="cleaning-office-person">
            {person}
            <button className="remove-btn" onClick={() => removePerson(person)}>
              x
            </button>
          </span>
        ))}
      </div>

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
