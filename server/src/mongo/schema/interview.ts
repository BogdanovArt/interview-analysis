import { beforeDelete } from "mongo/controllers/Interview/middleware/delete";
import { Schema, Document, model, MongooseDocumentMiddleware } from "mongoose";

import { Populatable } from "utils/types";
import { AtomType } from "./atom";

import { Entities } from "./enums";
import { ProjectType } from "./project";
import { TextBlockType } from "./textBlock";
import { UserType } from "./user";

export type InterviewStage = "edit" | "atomic-analysis";

export interface InterviewType extends Document {
  title?: string;
  created: Date;
  stage: InterviewStage;
  user_id: Populatable<UserType>;
  project_id: Populatable<ProjectType>;
  respondent: string;
  blocks: Array<Populatable<TextBlockType>>;
  atoms: Array<Populatable<AtomType>>;
}

const InterviewSchema = new Schema({
  title: { type: String, default: "" },
  created: { type: Date, default: Date.now() },
  user_id: { type: Schema.Types.ObjectId, ref: Entities.user },
  project_id: { type: Schema.Types.ObjectId, ref: Entities.project },
  stage: { type: String, default: "edit" },
  respondent: { type: String, default: "" },
  blocks: [
    {
      type: Schema.Types.ObjectId,
      ref: Entities.textBlock,
    },
  ],
  atoms: [
    {
      type: Schema.Types.ObjectId,
      ref: Entities.atom,
    },
  ],
});

InterviewSchema.pre(/remove/, beforeDelete);

const InterviewModel = model<InterviewType>(Entities.interview, InterviewSchema);

export default InterviewModel;
