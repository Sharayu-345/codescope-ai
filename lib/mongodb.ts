import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI!;

if (!MONGODB_URI) {
  throw new Error("Please define MONGODB_URI in .env.local");
}

let cached = (global as any).mongoose;

if (!cached) {
  cached = (global as any).mongoose = {
    conn: null,
    promise: null,
  };
}

export default async function connectDB() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, {
  serverSelectionTimeoutMS: 10000,
});
  }

  cached.conn = await cached.promise;
  console.log("✅ MongoDB Connected");

  return cached.conn;
}
console.log("MONGODB_URI =", process.env.MONGODB_URI);