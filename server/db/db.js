import mongoose from "mongoose";
import dotenv from "dotenv";

export default function connectTodb() {
  mongoose
    .connect(process.env.MONGO_URL)
    .then(() => {
      console.log("Connected to DB");
    })
    .catch((err) => console.log(err));
}
