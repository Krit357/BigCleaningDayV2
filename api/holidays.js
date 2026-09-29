import { getDb } from "./_db.js";

export async function GET() {
  const db = await getDb();
  const records = await db
    .collection("holidays")
    .find()
    .sort({ date: 1 })
    .toArray();

  return Response.json(records);
}

export async function POST(request) {
  const { date } = await request.json();

  if (!/^\d{4}-\d{2}-\d{2}$/.test(date ?? "")) {
    return Response.json({ error: "Invalid date" }, { status: 400 });
  }

  const db = await getDb();
  const result = await db.collection("holidays").insertOne({ date });

  return Response.json({ _id: result.insertedId, date }, { status: 201 });
}

export async function DELETE(request) {
  const date = new URL(request.url).searchParams.get("date");
  if (!date) {
    return Response.json({ error: "Date is required" }, { status: 400 });
  }

  const db = await getDb();
  const result = await db.collection("holidays").deleteOne({ date });

  if (result.deletedCount === 0) {
    return Response.json({ error: "Holiday not found" }, { status: 404 });
  }

  return new Response(null, { status: 204 });
}
