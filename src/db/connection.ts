import { MongoClient } from "mongodb";

type ConnectionObject = {
  isConnected?: boolean;
};

const connection: ConnectionObject = {};

export async function connect(): Promise<void> {
  if (connection.isConnected) {
    console.log("already connected");
    return;
  }
  try {
    const client = new MongoClient(process.env.MONGODB_URI || "", {});
    await client.connect();
    connection.isConnected = true;
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    process.exit(1);
  }
}
