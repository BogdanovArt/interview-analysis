import { AtomSchema, ProjectSchema, TextBlockSchema } from "store/projects/types";
import { Populated } from "types/index";

export type InterviewStage = "edit" | "atomic-analysis";

export interface InterviewState {
  fetching: boolean;
  interview: InterviewBase;
  blocks: TextBlockSchema[];
  atoms: AtomSchema[];
}

interface InterviewBase {
  _id?: string;
  title?: string;
  project_id?: Populated<ProjectSchema>;
  respondent?: string;
  stage: InterviewStage;
}

export interface InterviewContent {
  blocks: TextBlockSchema[];
  atoms: AtomSchema[];
}

export type InterviewSchema = InterviewBase & InterviewContent;

export interface AtomNodeEditPayload {
  _id: string;
  atom_id: string;
  atom_type: number;
  content: string;
  interview_id: string;
  block_id: string;
}

export interface AtomNodeAddPayload {
  DOM_id: string;
  atom_type: number;
  content: string;
  interview_id: string;
  block_id: string;
}
