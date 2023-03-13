import axios from "axios";

import { setProjectsData } from ".";
import { AppThunk } from "..";

import { AddPayload, EditPayload, RemovePayload } from "./types";

import { routes } from "routes/enums";
import getApiUrl from "utils/getApiUrl";
import { RequestMethods } from "types/enums";

export const requestProjects = (): AppThunk => async (dispatch) => {
  const { data } = await axios.get(getApiUrl(routes.projects));
  if (data) dispatch(setProjectsData(data));
};

export const addProject =
  (payload: AddPayload): AppThunk =>
  async () => {
    await axios({
      url: getApiUrl(routes.projects),
      method: RequestMethods.PUT,
      data: payload,
    });
  };

export const removeProject =
  (payload: RemovePayload): AppThunk =>
  async () => {
    await axios({
      url: getApiUrl(routes.projects),
      method: RequestMethods.DELETE,
      data: payload,
    });
  };

export const editProject =
  (payload: EditPayload): AppThunk =>
  async () => {
    await axios({
      url: getApiUrl(routes.project.replace(":project", payload.id)),
      method: RequestMethods.PATCH,
      data: payload,
    });
  };
