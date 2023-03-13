import axios from "axios";

import { AppThunk } from "..";
import { setInterviewsData } from ".";

import { routes } from "routes/enums";

import getApiUrl from "utils/getApiUrl";
import { RequestMethods } from "types/enums";
import { AddPayload, EditPayload, RemovePayload } from "./types";
import { InterviewSchema } from "store/interviews/types";

export const requestInterviews =
  ({ id }: { id: string }): AppThunk =>
  async (dispatch) => {
    const { data } = await axios.get(
      getApiUrl(routes.project.replace(":project", id))
    );
    if (data) dispatch(setInterviewsData(data));
  };

export const requestUnbound =
  (): AppThunk<Promise<{ data: InterviewSchema[] }>> => async () => {
    return await axios.get(getApiUrl(routes.interviews));
  };

export const addInterview =
  (payload: AddPayload): AppThunk =>
  async () => {
    await axios({
      url: getApiUrl("/interviews"),
      method: RequestMethods.PUT,
      data: payload,
    });
  };

export const removeInterview =
  (payload: RemovePayload): AppThunk =>
  async () => {
    await axios({
      url: getApiUrl("/interviews"),
      method: RequestMethods.DELETE,
      data: payload,
    });
  };

export const editInterview =
  (payload: EditPayload): AppThunk =>
  async () => {
    await axios({
      url: getApiUrl(`/interviews/${payload.id}`),
      method: RequestMethods.PUT,
      data: payload.interview,
    });
  };
