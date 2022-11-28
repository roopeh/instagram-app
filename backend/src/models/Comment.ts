import { Schema, model } from "mongoose";
import { IComment } from "../types";

const schema = new Schema<IComment>({
  author: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  photo: {
    type: Schema.Types.ObjectId,
    ref: "Photo",
    required: true,
  },
  date: {
    type: Number,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
});

export default model("Comment", schema);
