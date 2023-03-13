import { AtomType } from "mongo/schema/atom";

export type AtomsChanged = {
  [key: string]: AtomType | null;
};
