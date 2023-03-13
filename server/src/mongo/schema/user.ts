import { Schema, Document, model } from "mongoose";

import { Entities } from "./enums";

export interface UserType extends Document {
  first_name: string;
  last_name: string;
  created: Date;
}

const UserSchema = new Schema({
  first_name: { type: String || undefined, default: "" },
  last_name: { type: String || undefined, default: "" },
  created: { type: Date, default: Date.now() },
});

export default model<UserType>(Entities.user, UserSchema);

