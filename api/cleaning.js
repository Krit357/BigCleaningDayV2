// api/cleaning.js
import { getDb } from "./_db.js";

export async function GET() {
  const db = await getDb();
  const saved = await db.collection("cleaning").findOne({ _id: "office" });

  // defaultCleaning ต้องประกาศในไฟล์นี้หรือ import เข้ามา
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
