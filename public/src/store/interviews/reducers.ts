import { PayloadAction } from "@reduxjs/toolkit";

import { ProjectSchema } from "store/projects/types";

import { InterviewsState } from "./types";

const reducers = {
  setInterviewsData: (state: InterviewsState, action: PayloadAction<ProjectSchema | null>) => {
    state.project = action.payload;
  },
};

export default reducers;
