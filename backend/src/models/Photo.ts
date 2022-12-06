import { Schema, model } from "mongoose";
import { IPhoto } from "../types";

const schema = new Schema<IPhoto>({
  imageString: {
    type: String,
    required: true,
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  publishDate: {
    type: Number,
    required: true,
  },
  captionText: {
    type: String,
  },
  isFeedPhoto: {
    type: Boolean,
    required: true,
  },
  likes: [
    {
      type: Schema.Types.ObjectId,
      ref: "Like",
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
