import { InterviewSchema } from "store/interview/types";
import { Populated } from "types/index";

export interface ProjectsState {
  data: ProjectSchema[];
}

export interface AddPayload {
  title: string;
}

export interface RemovePayload {
  id: string;
}

export interface EditPayload {
  id: string;
  title: string;
}

export interface ProjectSchema {
  _id: string;
  title: string;
  created: Date;
  interviews: InterviewSchema[];
}

export interface TextBlockSchema {
  _id: string;
  interview_id: Populated<InterviewSchema>;
  nodes?: Array<Populated<AtomNodeSchema>>;
  order: number;
  content: string;
  source: string;
}

export interface TextBlockPayload {
  source: string;
}

export interface AtomSchema {
  _id?: string;
  content: string;
  atom_type?: number;
  interview_id?: string;
  nodes?: AtomNodeSchema[];
}

export interface AtomNodeSchema {
  DOM_id: string;
  _id: string;
  atom_id: string;
  block_id: string;
}
