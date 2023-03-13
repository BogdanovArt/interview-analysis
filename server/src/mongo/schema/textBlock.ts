import { Schema, Document, model } from "mongoose";

import { Populatable } from "utils/types";
import { AtomNodeType } from "./atomNode";

import { Entities } from "./enums";
import { InterviewType } from "./interview";

export interface TextBlockBase {
  interview_id?: Populatable<InterviewType>;
  order: number;
  source: string;
  content: string;
  nodes: Array<Populatable<AtomNodeType>>;
}

export type TextBlockType = Document & TextBlockBase;

const TextBlockSchema = new Schema({
  created: { type: Date, default: Date.now() },
  interview_id: { type: Schema.Types.ObjectId, ref: Entities.interview },
  source: { type: String, default: "" },
  content: { type: String, default: "" },
  order: { type: Number, default: 0 },
  nodes: [
    {
      type: Schema.Types.ObjectId,
      ref: Entities.node,
    },
  ],
});

export default model<TextBlockType>(Entities.textBlock, TextBlockSchema);
