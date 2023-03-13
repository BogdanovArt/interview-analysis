import { PayloadAction } from "@reduxjs/toolkit";

import { ProjectSchema, ProjectsState } from "./types";

const reducers = {
  setProjectsData: (state: ProjectsState, action: PayloadAction<ProjectSchema[]>) => {
    state.data = action.payload;
  },
};

export default reducers;
