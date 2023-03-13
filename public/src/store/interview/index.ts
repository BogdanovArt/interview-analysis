import { createSlice } from "@reduxjs/toolkit";

import { InterviewSchema, InterviewState } from "./types";

import reducers from "./reducers";

export const initialState: InterviewState = {
  fetching: false,
  interview: {
    stage: "edit",
  },
  blocks: [],
  atoms: [],
};

export const analysisSlice = createSlice({
  name: "analysis",
  initialState,
  reducers,
});

export const {
  setInterviewContent,
  setInterview,
  setTextBlock,
  setTextBlocks,
  setFetching,
  resetInterview,
  addTextBlock,
  addAtom,
  deleteAtom,
} = analysisSlice.actions;

export default analysisSlice.reducer;
