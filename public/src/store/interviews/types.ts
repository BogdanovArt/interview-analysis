import {
  AnalysisSchema,
  AtomSchema,
  TextBlockSchema,
} from "store/projects/types";
import { IBasicObject } from "types/index";

export interface InterviewsState {
  project: ProjectData | null;
}

export interface ProjectData {
  _id?: string;
  name?: string;
  created?: Date;
  project_id?: string;
  interviews: InterviewSchema[];
  atoms: AtomSchema[];
}

export interface InterviewSchema {
  _id?: string;
  date?: string;
  title?: string;
  project_id?: string;
  content: AnalysisSchema;
}

export interface AddPayload {
  project_id: string;
  title: string;
  content: {
    text: TextBlockSchema;
    atoms: AtomSchema[];
  };
}

export interface RemovePayload {
  id: string;
}

export interface EditPayload extends RemovePayload {
  interview: IBasicObject;
}
