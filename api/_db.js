import process from "node:process";
import { MongoClient } from "mongodb";

let clientPromise;

export async function getDb() {
  if (!process.env.MONGODB_URI) {
    throw new Error("MONGODB_URI is missing");
  }

  if (!clientPromise) {
    const client = new MongoClient(process.env.MONGODB_URI);
    clientPromise = client.connect();
  }

  const client = await clientPromise;
  return client.db("companyScheduler");
}
