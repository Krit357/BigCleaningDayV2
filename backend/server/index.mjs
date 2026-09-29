import express from "express";
import cors from "cors";
import "dotenv/config";
import { MongoClient } from "mongodb";

const app = express();
app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());

const client = new MongoClient(process.env.MONGODB_URI);

async function start() {
  await client.connect();

  const holidays = client.db("companyScheduler").collection("holidays");

  app.get("/api/holidays", async (req, res) => {
    const records = await holidays.find().sort({ date: 1 }).toArray();
    res.json(records);
  });

  app.post("/api/holidays", async (req, res) => {
    const { date } = req.body;

    if (!/^\d{4}-\d{2}-\d{2}$/.test(date ?? "")) {
      return res.status(400).json({ error: "Invalid date" });
    }

    const result = await holidays.insertOne({ date });
    res.status(201).json({ _id: result.insertedId, date });
  });

  app.delete("/api/holidays/:date", async (req, res) => {
    const result = await holidays.deleteOne({ date: req.params.date });

    if (result.deletedCount === 0) {
      return res.status(404).json({ error: "Holiday not found" });
    }

    res.sendStatus(204);
  });

  app.listen(process.env.PORT || 3001, () => {
    console.log("API running on port 3001");
  });
}

start().catch(console.error);
