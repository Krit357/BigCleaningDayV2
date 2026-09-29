// api/cleaning.js
import { getDb } from "./_db.js";

const defaultCleaning = {
  peopleList: [
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
  ],
  duties: {
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
  },
};

export async function GET() {
  const db = await getDb();
  const saved = await db.collection("cleaning").findOne({ _id: "office" });

  return Response.json(
    saved
      ? { peopleList: saved.peopleList, duties: saved.duties }
      : defaultCleaning,
  );
}

export async function PUT(request) {
  const { peopleList, duties } = await request.json();

  if (!Array.isArray(peopleList) || !duties || typeof duties !== "object") {
    return Response.json({ error: "Invalid cleaning data" }, { status: 400 });
  }

  const db = await getDb();
  await db
    .collection("cleaning")
    .updateOne(
      { _id: "office" },
      { $set: { peopleList, duties } },
      { upsert: true },
    );

  return Response.json({ peopleList, duties });
}
