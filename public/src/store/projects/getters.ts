import { RootState } from "store";

export const getPageData = (state: RootState) => state.projects.data;