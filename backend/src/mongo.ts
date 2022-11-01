import mongoose from "mongoose";
import { MONGODB_URI } from "./utils/config";
import { logError, logInfo } from "./utils/logger";

const connectToMongo = async (): Promise<boolean> => {
  logInfo("Connecting to MongoDB");
  try {
    await mongoose.connect(MONGODB_URI);
    logInfo("Connected to MongoDB");
    return true;
  } catch (error) {
    if (error instanceof mongoose.mongo.MongoError) {
      logError(`Error while connecting to MongoDB: ${error.message}`);
    } else {
      logError(`Unknown error: ${error}`);
    }
    return false;
  }
};

export default connectToMongo;
