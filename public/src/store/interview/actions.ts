import axios from "axios";

import { AppThunk } from "..";
import { setInterview, addAtom, deleteAtom, setTextBlock, setTextBlocks } from ".";

import { routes } from "routes/enums";

import { RequestMethods } from "types/enums";
import { AtomNodeAddPayload, AtomNodeEditPayload, InterviewSchema } from "store/interview/types";
import { AtomNodeSchema, AtomSchema, TextBlockSchema } from "store/projects/types";

import getApiUrl from "utils/getApiUrl";
import { asyncForEach } from "utils/textControls";

export const requestInterview =
  ({ id }: { id: string }): AppThunk =>
  async (dispatch) => {
    const url = getApiUrl(routes.interview.replace(":id", id));
    const { data } = await axios.get(url);
    if (data) dispatch(setInterview(data));
  };

export const editInterview =
  (interview: InterviewSchema): AppThunk =>
  async (dispatch) => {
    const { data, status } = await axios({
      url: getApiUrl(routes.interview.replace(":id", interview._id)),
      method: RequestMethods.PATCH,
      data: interview,
    });
    if (data) dispatch(setInterview(data));
  };

type EditReturn = Promise<AtomNodeSchema | undefined>;

export const editInterviewContent =
  ({ blocks, id }: { blocks: TextBlockSchema[]; id: string }): AppThunk =>
  async (dispatch) => {
    const { data, status } = await axios({
      url: getApiUrl(routes.edit.replace(":id", id)),
      method: RequestMethods.POST,
      data: { blocks },
    });

    return data;
  };

export const hardResetInterview =
  (id: string): AppThunk =>
  async (dispatch) => {
    const { data, status } = await axios({
      url: getApiUrl(routes.reset.replace(":id", id)),
      method: RequestMethods.POST,
    });
    if (data) dispatch(setInterview(data));
  };

export const editAtomNode =
  (atomNode: AtomNodeEditPayload): AppThunk<EditReturn> =>
  async (dispatch, getState) => {
    try {
      const { data, status } = await axios({
        url: getApiUrl(routes.nodes),
        method: RequestMethods.OPTIONS,
        data: atomNode,
      });

      if (data?.data.node && data?.data.atom) {
        const newAtom: AtomSchema = data.data.atom;
        const oldAtom: AtomSchema | null = data.data.oldAtom;

        dispatch(addAtom(newAtom));

        if (!!oldAtom) {
          dispatch(addAtom(oldAtom));
        } else {
          dispatch(deleteAtom({ _id: atomNode.atom_id }));
        }

        // console.warn({ newAtom, oldAtom, node: data.data.node });
      }

      return data?.data.node;
    } catch (err) {
      console.warn(err);
    }
  };

type AddReturn = Promise<{ node: AtomNodeSchema; atom: AtomSchema } | undefined>;

export const addAtomNode =
  (node: AtomNodeAddPayload): AppThunk<AddReturn> =>
  async (dispatch) => {
    try {
      const { data, status } = await axios({
        url: getApiUrl(routes.nodes),
        method: RequestMethods.PUT,
        data: node,
      });

      if (data.data.atom) {
        await dispatch(addAtom(data.data.atom));
      }

      return data.data;
    } catch (err) {
      console.warn(err);
    }
  };

type DeleteReturn = Promise<{ success: boolean } | undefined>;

export const deleteAtomNodes =
  (nodes: HTMLElement[]): AppThunk<DeleteReturn> =>
  async (dispatch) => {
    try {
      const payload = nodes.map((node) => node.id);

      const { data, status } = await axios({
        url: getApiUrl(routes.nodes),
        method: RequestMethods.DELETE,
        data: { nodes: payload },
      });

      if (data.atoms) {
        const AffectedAtoms = Object.entries(data.atoms) as Array<[string, AtomSchema | null]>;
        await asyncForEach(AffectedAtoms, async ([key, atom]) => {
          atom ? await dispatch(addAtom(atom)) : await dispatch(deleteAtom({ _id: key }));
        });
      }

      return data;
    } catch (err) {
      console.warn(err);
    }
  };

export interface ChangeBlockPayload {
  _id: string;
  nodes: string[];
  content: string;
}

type ChangeBlockResponse = Promise<TextBlockSchema | undefined>;

export const changeTextBlock =
  (payload: ChangeBlockPayload): AppThunk<ChangeBlockResponse> =>
  async (dispatch) => {
    try {
      const { data, status } = await axios({
        url: getApiUrl(routes.textblock.replace(":id", payload._id)),
        method: RequestMethods.PATCH,
        data: payload,
      });

      await dispatch(setTextBlock(data._doc));
      return data;
    } catch (err) {
      console.warn(err);
    }
  };

export const changeTextBlocks =
  (payload: ChangeBlockPayload[]): AppThunk<ChangeBlockResponse> =>
  async (dispatch) => {
    try {
      const { data, status } = await axios({
        url: getApiUrl(routes.textblocks),
        method: RequestMethods.PATCH,
        data: { blocks: payload },
      });

      if (data) {
        await dispatch(setTextBlocks(data));
      }

      return data;
    } catch (err) {
      console.warn(err);
    }
  };
