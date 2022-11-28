import { Schema, model } from "mongoose";
import { IPhotoLike } from "../types";

const schema = new Schema<IPhotoLike>({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  photo: {
    type: Schema.Types.ObjectId,
    ref: "Photo",
  },
  likeDate: {
    type: Number,
    required: true,
  },
});

export default model("Like", schema);
