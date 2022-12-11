import { Schema, model } from "mongoose";
import { IConversation } from "../types";

const schema = new Schema<IConversation>({
  participiants: [
    {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  messages: [
    {
      type: Schema.Types.ObjectId,
      ref: "Message",
    },
  ],
});

export default model("Conversation", schema);
