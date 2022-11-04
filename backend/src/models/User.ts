import { Schema, model, mongo } from "mongoose";
import crypto from "crypto";
import argon2 from "argon2";
import { DbUser } from "../types";
import { logError } from "../utils/logger";

const schema = new Schema<DbUser>({
  username: {
    type: String,
    minlength: [5, "Username must be at least 5 characters long"],
    maxlength: [15, "Username must be less than 15 characters long"],
    required: [true, "Missing username"],
    unique: true,
  },
  password: {
    type: String,
    required: [true, "Missing password"],
  },
  firstName: {
    type: String,
    required: [true, "Missing firstname"],
  },
  lastName: {
    type: String,
    required: [true, "Missing lastname"],
  },
  bioText: {
    type: String,
  },
  lastOnline: {
    type: String,
  },
  profilePhoto: {
    type: Schema.Types.ObjectId,
    ref: "Photo",
  },
  coverPhoto: {
    type: Schema.Types.ObjectId,
    ref: "Photo",
  },
  photos: [
    {
      type: Schema.Types.ObjectId,
      ref: "Photo",
    },
  ],
  following: [
    {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  followers: [
    {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  ],
});

const argonHashConfig: argon2.Options = {
  parallelism: 1,
  memoryCost: 32000, // 32mb
  timeCost: 3, // Number of iterations
};

schema.methods.encryptPassword = async function encryptPassword(): Promise<void> {
  const salt = crypto.randomBytes(32);
  try {
    this.password = await argon2.hash(this.password, {
      ...argonHashConfig as any,
      salt,
    });
  } catch (error) {
    logError(`Failure in password hashing: ${error}`);
    throw new mongo.MongoError("Internal server error");
  }
};

schema.methods.isValidPassword = async function isValidPass(password: string): Promise<boolean> {
  try {
    const passwordMatches = await argon2.verify(this.password, password, argonHashConfig);
    return passwordMatches;
  } catch (error) {
    logError(`Failure in password verification: ${error}`);
    throw new mongo.MongoError("Internal server error");
  }
};

export default model<DbUser>("User", schema);
