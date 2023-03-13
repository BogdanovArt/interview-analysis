export interface ProjectsState {
  data: ProjectSchema[];
}

export interface AddPayload {
  name: string;
}

export interface RemovePayload {
  id: string;
}

export interface EditPayload {
  id: string;
  name: string;
}

export interface ProjectSchema {
  _id: string;
  name: string;
  created: Date;
  interviews: InterviewSchema[];
  atoms: AtomSchema[];
}

export interface InterviewSchema {
  _id?: string;
  date?: string;
  title?: string;
  content: AnalysisSchema;
}

export interface AnalysisSchema {
  text: TextBlockSchema;
  atoms: AtomSchema[];
}

export interface TextBlockSchema {
  id: number;
  text: string;
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
}

