// src/components/Cleaning_Office.jsx
import React, { useState, useEffect } from "react";
import "./Cleaning_Office.css";
const API_BASE = import.meta.env.DEV ? "http://localhost:3001" : "";

const defaultPeoples = [
  "Yok",
  "Ethan",
  "Chris",
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
    requiredPersons: 2,
    assignedPersons: ["Hut", "Fah"],
  },
  dusting: {
    task: "ปัดฝุ่น",
    requiredPersons: 1,
    assignedPersons: ["Christian"],
  },
  sweepFloor: {
    task: "กวาดพื้น",
    requiredPersons: 4,
    assignedPersons: ["Sky", "Ethan", "Rose", "Lucus"],
  },
  mopFloor: {
    task: "ถูพื้น",
    requiredPersons: 4,
    assignedPersons: ["Chris", "Yok", "Min", "Mook"],
  },
  meetingRoom: {
    task: "ห้องประชุม",
    requiredPersons: 1,
    assignedPersons: ["Moss"],
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
  const [peopleList, setPeopleList] = useState(defaultPeoples);
  const [duties, setDuties] = useState(initialDuties);
  const [newPersonName, setNewPersonName] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_BASE}/api/cleaning`)
      .then((res) => {
        if (!res.ok) throw new Error("โหลดข้อมูลไม่สำเร็จ");
        return res.json();
      })
      .then((data) => {
        setPeopleList(data.peopleList);
        setDuties(data.duties);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const saveCleaning = async (nextPeopleList, nextDuties) => {
    const res = await fetch(`${API_BASE}/api/cleaning`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        peopleList: nextPeopleList,
        duties: nextDuties,
      }),
    });

    if (!res.ok) throw new Error("บันทึกข้อมูลไม่สำเร็จ");

    setPeopleList(nextPeopleList);
    setDuties(nextDuties);
  };

  const addPerson = async () => {
    const name = newPersonName.trim();

    if (!name) return alert("กรุณาใส่ชื่อ");
    if (peopleList.includes(name)) return alert("มีชื่อนี้อยู่แล้ว");

    try {
      await saveCleaning([...peopleList, name], duties);
      setNewPersonName("");
    } catch (error) {
      alert(error.message);
    }
  };

  const removePerson = async (name) => {
    const isAssigned = Object.values(duties).some((duty) =>
      duty.assignedPersons.includes(name),
    );

    if (isAssigned) {
      alert("ไม่สามารถลบได้ เพราะชื่อนี้ถูก assign อยู่ในหน้าที่ปัจจุบัน");
      return;
    }

    try {
      await saveCleaning(
        peopleList.filter((person) => person !== name),
        duties,
      );
    } catch (error) {
      alert(error.message);
    }
  };

  const clearAssignments = async () => {
    const clearedDuties = Object.fromEntries(
      Object.entries(duties).map(([key, duty]) => [
        key,
        { ...duty, assignedPersons: [] },
      ]),
    );

    try {
      await saveCleaning(peopleList, clearedDuties);
    } catch (error) {
      alert(error.message);
    }
  };

  const assignDuties = async () => {
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

    try {
      await saveCleaning(peopleList, newDuties);
    } catch (error) {
      alert(error.message);
    }
  };

  const resetDuties = async () => {
    try {
      await saveCleaning(peopleList, JSON.parse(JSON.stringify(initialDuties)));
    } catch (error) {
      alert(error.message);
    }
  };

  const resetPeople = async () => {
    const cleanedDuties = Object.fromEntries(
      Object.entries(duties).map(([key, duty]) => [
        key,
        {
          ...duty,
          assignedPersons: duty.assignedPersons.filter((name) =>
            defaultPeoples.includes(name),
          ),
        },
      ]),
    );

    try {
      await saveCleaning([...defaultPeoples], cleanedDuties);
    } catch (error) {
      alert(error.message);
    }
  };
  if (loading) return <div>Loading...</div>;

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
        <button className="cleaning-office-button" onClick={clearAssignments}>
          Clear Assignments
        </button>
      </div>

      <div className="cleaning-office-form">
        <input
          type="text"
          value={newPersonName}
          placeholder="ใส่ชื่อคน"
          onChange={(e) => setNewPersonName(e.target.value)}
        />

        <button className="cleaning-office-button" onClick={addPerson}>
          Add Person
        </button>
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
