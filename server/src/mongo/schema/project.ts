import { Schema, Document, model } from "mongoose";

import { beforeDelete } from "../controllers/Project/middleware/delete";

import { Entities } from "./enums";
import { InterviewType } from "./interview";

import { UserType } from "./user";

export interface ProjectType extends Document {
  title?: string;
  created: Date;
  interviews: InterviewType[];
  creator: UserType;
}

const ProjectSchema = new Schema({
  title: { type: String || undefined, default: "" },
  created: { type: Date, default: Date.now() },
  creator: { type: Schema.Types.ObjectId, ref: Entities.user },
  interviews: [
    {
      type: Schema.Types.ObjectId,
      ref: Entities.interview,
    },
  ],
});

ProjectSchema.pre(/remove/, beforeDelete);

const ProjectModel = model<ProjectType>(Entities.project, ProjectSchema);

export default ProjectModel;
