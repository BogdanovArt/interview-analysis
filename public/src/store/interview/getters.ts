import { RootState } from "store";

export const getInterviewMetaData = (state: RootState) => state.interview.interview;
export const getInterviewBlocks = (state: RootState) => state.interview.blocks;
export const getInterviewAtoms = (state: RootState) => state.interview.atoms;