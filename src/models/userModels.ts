import { MongoClient } from "mongodb";

let cachedClient: MongoClient | null = null;
let cachedDb: any = null;

// MongoDB connection URL
const client = new MongoClient(process.env.MONGODB_URI || "");
const dbName = "your_database_name"; // Update this with your actual DB name

async function connectToDatabase() {
  // If a cached connection exists, return it
  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb };
  }

  try {
    // Connect to MongoDB if no cached connection
    await client.connect();
    cachedClient = client;
    cachedDb = client.db(dbName);

    console.log("Connected to MongoDB");

    return { client, db: cachedDb };
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    throw error;
  }
}

export async function getUsersCollection() {
  const { db } = await connectToDatabase();
  return db.collection("users");
}
// import mongoose from "mongoose";

// const personSchema = new mongoose.Schema(
//   {
//     first_name: { type: String, required: true },
//     last_name: { type: String, required: true },
//     age: { type: Number, required: true },
//     gender: { type: String, enum: ["male", "female", "other"], required: true },
//     email: { type: String, required: true, unique: true },
//     phone: { type: String, required: true },
//     address: {
//       street: { type: String, required: true },
//       city: { type: String, required: true },
//       state: { type: String, required: true },
//       zip_code: { type: String, required: true },
//       country: { type: String, required: true },
//     },
//     spouse: {
//       first_name: { type: String },
//       last_name: { type: String },
//       age: { type: Number },
//       gender: { type: String, enum: ["male", "female", "other"] },
//     },
//     children: [
//       {
//         first_name: { type: String, required: true },
//         last_name: { type: String, required: true },
//         age: { type: Number, required: true },
//         gender: {
//           type: String,
//           enum: ["male", "female", "other"],
//           required: true,
//         },
//       },
//     ],
//     createdAt: { type: Date, default: Date.now },
//     role: { type: String, enum: ["user", "admin"], default: "user" },
//   },
//   { timestamps: true }
// );

// const Person = mongoose.models.Person || mongoose.model("Person", personSchema);
// export default Person;
