import { Schema, model } from "mongoose";
import { IPhoto } from "../types";

const schema = new Schema<IPhoto>({
  imageString: {
    type: String,
    required: true,
  },
  publishDate: {
    type: String,
    required: true,
  },
  likes: [
    {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  comments: [
    {
      type: Schema.Types.ObjectId,
      ref: "Comment",
    },
  ],
});

export default model("Photo", schema);