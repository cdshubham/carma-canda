import mongoose from "mongoose";

export async function connect() {
  try {
    mongoose.connect(process.env.MONGODB_URI!);
    const connection = mongoose.connection;
    connection.on("connected", () => {
      console.log("Connection established");
    });
    connection.on("error", (err) => {
      console.log("Error in connecting to MongoDB", err);
      process.exit(1);
    });
  } catch (err) {
    console.log("Error connecting to MongoDB", err);
  }
}
