import axios from "axios";

import { AppThunk } from "..";
import {
  setAnalysisContent,
  setAnalysis,
  setTextBlock,
} from ".";

import { routes } from "routes/enums";

import { RequestMethods } from "types/enums";
import {
  AnalysisSchema,
  AtomAddPayload,
  AtomEditPayload,
} from "store/analysis/types";
import {
  AtomNodeSchema,
  AtomSchema,
  TextBlockSchema,
} from "store/projects/types";

import getApiUrl from "utils/getApiUrl";
import { AtomNodeData } from "components/common/Inputs/Text/Extensions/types";

export const requestAnalysis =
  ({ id }: { id: string }): AppThunk =>
  async (dispatch) => {
    const url = getApiUrl(routes.interview.replace(":id", id));
    const { data } = await axios.get(url);
    if (data) dispatch(setAnalysis(data));
  };

export const requestContent =
  ({ id }: { id: string }): AppThunk =>
  async (dispatch) => {
    const url = getApiUrl(routes.interview.replace(":id", id));
    const { data }: { data: AnalysisSchema } = await axios.get(url);
    if (data && data.content) dispatch(setAnalysisContent(data.content));
  };

export const editAnalysis =
  (interview: AnalysisSchema): AppThunk =>
  async (dispatch) => {
    const { data, status } = await axios({
      url: getApiUrl(routes.interview.replace(":id", interview._id)),
      method: RequestMethods.PUT,
      data: interview,
    });
    if (data) dispatch(setAnalysis(data));
  };

type EditReturn = Promise<AtomNodeSchema | undefined>;

export const editAtom =
  (atom: AtomEditPayload): AppThunk<EditReturn> =>
  async (dispatch) => {
    try {
      const { data, status } = await axios({
        url: getApiUrl(routes.atoms),
        method: RequestMethods.OPTIONS,
        data: atom,
      });

      return data?.data;
    } catch (err) {
      console.warn(err);
    }
  };

type AddReturn = Promise<
  { node: AtomNodeSchema; atom: AtomSchema } | undefined
>;

export const addAtom =
  (atom: AtomAddPayload): AppThunk<AddReturn> =>
  async (dispatch) => {
    try {
      const { data, status } = await axios({
        url: getApiUrl(routes.atoms),
        method: RequestMethods.PUT,
        data: atom,
      });
      return data?.data;
    } catch (err) {
      console.warn(err);
    }
  };

type DeleteReturn = Promise<{ success: boolean } | undefined>;

export const deleteAtom =
  (atom: AtomNodeSchema): AppThunk<DeleteReturn> =>
  async (dispatch) => {
    try {
      const { data, status } = await axios({
        url: getApiUrl(routes.atoms),
        method: RequestMethods.DELETE,
        data: atom,
      });
      return data;
    } catch (err) {
      console.warn(err);
    }
  };
