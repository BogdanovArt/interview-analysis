import { configureStore, ThunkAction, Action } from "@reduxjs/toolkit";

import projectsModule from "./projects";
import interviewsModule from "./interviews";
import analysisModule from "./analysis";

export const store = configureStore({
  reducer: {
    projects: projectsModule,
    interviews: interviewsModule,
    analysis: analysisModule,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
