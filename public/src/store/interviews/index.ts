import { createSlice } from "@reduxjs/toolkit";

import { InterviewsState } from "./types";

import reducers from "./reducers";

const initialState: InterviewsState = {
  project: null,
};

export const interviewsSlice = createSlice({
  name: "interviews",
  initialState,
  reducers,
});

export const { setInterviewsData } = interviewsSlice.actions;

export default interviewsSlice.reducer;