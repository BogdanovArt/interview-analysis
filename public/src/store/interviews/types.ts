import { AtomSchema, ProjectSchema, TextBlockSchema } from "store/projects/types";
import { IBasicObject, Populated } from "types/index";

export interface InterviewsState {
  project: ProjectSchema | null;
}

export interface AddInterviewPayload {
  project_id: string;
  title: string;
  respondent?: string;
  source: string[];
}

export interface RemovePayload {
  id: string;
}

export interface EditPayload extends RemovePayload {
  interview: IBasicObject;
}
