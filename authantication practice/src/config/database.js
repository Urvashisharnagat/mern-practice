import mongoose from "mongoose";
import config from "./config.js";

const connecttodb = async () => {
  try {
    await mongoose.connect(config.MONGO_URI);

    console.log("MongoDB Connected");
  } catch (error) {
    console.log(error);
  }
};

export default connecttodb;