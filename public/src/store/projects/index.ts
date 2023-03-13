import { createSlice } from "@reduxjs/toolkit";

import { ProjectsState } from "./types";

import reducers from "./reducers";

const initialState: ProjectsState = {
  data: [],
};

export const projectsSlice = createSlice({
  name: "projects",
  initialState,
  reducers,
});

export const { setProjectsData } = projectsSlice.actions;

export default projectsSlice.reducer;