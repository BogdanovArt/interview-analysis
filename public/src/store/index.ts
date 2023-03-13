import { configureStore, ThunkAction, Action } from "@reduxjs/toolkit";

import projectsModule from "./projects";
import interviewsModule from "./interviews";
import interviewModule from "./interview";

export const store = configureStore({
  reducer: {
    projects: projectsModule,
    interviews: interviewsModule,
    interview: interviewModule,
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
