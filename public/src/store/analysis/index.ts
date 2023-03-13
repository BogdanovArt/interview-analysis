import { createSlice } from "@reduxjs/toolkit";

import { AnalysisState } from "./types";

import reducers from "./reducers";

export const initialState: AnalysisState = {
  fetching: false,
  interview: {},
  content: {
    text: {
      id: 0,
      text: "",
    },
    atoms: [],
  },
};

export const analysisSlice = createSlice({
  name: "analysis",
  initialState,
  reducers,
});

export const {
  setAnalysisContent,
  setAnalysis,
  setTextBlock,
  setFetching,
} = analysisSlice.actions;

export default analysisSlice.reducer;
