import { Schema, Document, model } from "mongoose";

import { Entities } from "./enums";
import { TextBlockType } from "./textBlock";

import { Populatable } from "utils/types";
import { AtomType } from "./atom";

export interface AtomNodeBase {
  DOM_id: string;
  created: Date;
  atom_id: Populatable<AtomType>;
  block_id: Populatable<TextBlockType>;
}

export type AtomNodeType = AtomNodeBase & Document;

const AtomNodeSchema = new Schema({
  DOM_id: { type: String, default: "" },
  created: { type: Date, default: Date.now() },
  atom_id: {
    type: Schema.Types.ObjectId,
    ref: Entities.atom,
  },
  block_id: {
    type: Schema.Types.ObjectId,
    ref: Entities.textBlock,
  },
});

const AtomNodeModel = model<AtomNodeType>(Entities.node, AtomNodeSchema);

export default AtomNodeModel;
