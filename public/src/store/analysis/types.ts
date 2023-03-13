import { ProjectData } from "store/interviews/types";
import { AtomSchema, TextBlockSchema } from "store/projects/types";

export interface AnalysisState {
  fetching: boolean;
  interview: AnalysisMeta;  
  content: AnalysisContent;
}

export type AnalysisMeta = Omit<AnalysisSchema, "content">;

export interface AnalysisSchema {
  _id?: string;
  title?: string;
  content: AnalysisContent;
  project_id?: ProjectData;
}

export interface AnalysisContent {
  text: TextBlockSchema;
  atoms: AtomSchema[];
}

export interface AtomEditPayload {
  _id: string;
  atom_id: string;
  atom_type: number;
  content: string;
  interview_id: string;
}

export interface AtomAddPayload {
  DOM_id: string;
  atom_type: number;
  content: string;
  interview_id: string;
}