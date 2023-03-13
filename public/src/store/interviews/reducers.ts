import { PayloadAction } from "@reduxjs/toolkit";

import { InterviewsState, ProjectData } from "./types";

const reducers = {
  setInterviewsData: (state: InterviewsState, action: PayloadAction<ProjectData | null>) => {
    state.project = action.payload;
  },
};

export default reducers;
