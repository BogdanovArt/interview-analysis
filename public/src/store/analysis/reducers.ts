import { PayloadAction } from "@reduxjs/toolkit";
import { AtomSchema, TextBlockSchema } from "store/projects/types";

import { AnalysisState, AnalysisContent, AnalysisSchema } from "./types";

const cloneWrapper = (
  state: AnalysisState,
  modifier: (content: AnalysisContent) => void
) => {
  const content = JSON.parse(JSON.stringify(state.content));
  modifier(content);
  return content;
};

const reducers = {
  setAnalysis: (
    state: AnalysisState,
    action: PayloadAction<AnalysisSchema>
  ) => {
    const { content, _id, project_id, title } = action.payload;
    state.interview = { _id, project_id, title };
    state.content = content;
  },
  setAnalysisContent: (
    state: AnalysisState,
    action: PayloadAction<AnalysisContent>
  ) => {
    state.content = action.payload;
  },
  setTextBlock: (
    state: AnalysisState,
    action: PayloadAction<TextBlockSchema>
  ) => {
    const modifier = (content: AnalysisContent) => {
      content.text = action.payload;
    };
    state.content = cloneWrapper(state, modifier);
  },
  setFetching: (state: AnalysisState, action: PayloadAction<boolean>) => {
    state.fetching = action.payload;
  },
};

export default reducers;
