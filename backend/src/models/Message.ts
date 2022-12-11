import { Schema, model } from "mongoose";
import { IMessage } from "../types";

const schema = new Schema<IMessage>({
  sender: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  conversation: {
    type: Schema.Types.ObjectId,
    ref: "Conversation",
  },
  date: {
    type: Number,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  usersUnread: [
    {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  ],
});

export default model("Message", schema);
