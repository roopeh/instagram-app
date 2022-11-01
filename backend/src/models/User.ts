import { Schema, model } from "mongoose";
import { IUser } from "../types";

const schema = new Schema<IUser>({
  username: {
    type: String,
    minlength: 5,
    maxlength: 15,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    minlength: 5,
    required: true,
  },
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
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

export default model("User", schema);
