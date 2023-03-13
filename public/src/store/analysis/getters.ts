import { RootState } from "store";

export const getAnalysisMetaData = (state: RootState) => state.analysis.interview;
export const getAnalysisContent = (state: RootState) => state.analysis.content;