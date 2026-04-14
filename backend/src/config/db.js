import "./env.js";

import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MONGODB CONNECTED SUCCESSFULLY!");
  } catch (error) {
    const isAuthError =
      error?.code === 8000 || /authentication failed|bad auth/i.test(error?.message || "");

    if (isAuthError) {
      console.error(
        "MongoDB authentication failed. Check the username/password in backend/.env MONGO_URI."
      );
    } else {
      console.error("Error connecting to MONGODB", error);
    }

    process.exit(1); // exit with failure
  }
};
