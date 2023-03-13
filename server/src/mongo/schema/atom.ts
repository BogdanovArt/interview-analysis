import { Schema, Document, model } from "mongoose";

import { InterviewType } from "./interview";
import { AtomNodeType } from "./atomNode";
import { Entities } from "./enums";

import { Populatable } from "utils/types";

export interface AtomBase {
  atom_type: number;
  content: string;
  created: Date;
  interview_id: Populatable<InterviewType>;
  nodes: Array<Populatable<AtomNodeType>>;
}

export type AtomType = AtomBase & Document;

const AtomSchema = new Schema({
  atom_type: { type: Number, default: 0 },
  content: { type: String, default: "" },
  created: { type: Date, default: Date.now() },
  interview_id: {
    type: Schema.Types.ObjectId,
    ref: Entities.interview,
  },
  nodes: [
    {
      type: Schema.Types.ObjectId,
      ref: Entities.node,
    },
  ],
});

const AtomModel = model<AtomType>(Entities.atom, AtomSchema);

export default AtomModel;
