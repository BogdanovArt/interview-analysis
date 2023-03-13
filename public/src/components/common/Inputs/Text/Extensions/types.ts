export enum AtomAttrs {
  id = "data-unit_id",
  type = "data-type",
  nodeType = "data-node-type",
} 

export type AtomProps = {
  [key in AtomAttrs]: string | number;
}

export interface AtomUnit {
  id: number;
  title: string;
  cssClass: string;
  htmlTag: string;
  key?: string;
}

export type AtomTypesData = {
  [key: number]: AtomUnit;
}

export interface SelectPayload { 
  type: string;
  nodes: HTMLElement[];
}

export interface AtomNodeData {
  DOM_id: string;
  atom_type: number;
  atom_id: string;
  content: string;
  unit_id: string;
}

