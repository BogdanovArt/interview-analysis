import { RefObject } from "react";

export interface AtomI {
  id: string;
  _id?: string;
  content: string;
  atom_type?: number;
  interview_id?: string;
  project_id?: string;
  text_block_ids?: string[];
  deleted?: boolean;
}

export interface TextBlockI {
  id: string | number;
  text: string;
}

export interface SelectionArguments { 
  type: string;
  nodes: HTMLElement[];
  id: string | number;
  text: HTMLElement;
}