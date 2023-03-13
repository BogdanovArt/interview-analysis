import { PayloadAction } from "@reduxjs/toolkit";
import { Actions } from "components/pages/Projects/enums";
import { AtomSchema, TextBlockSchema } from "store/projects/types";

import { initialState } from ".";

import { InterviewState, InterviewContent, InterviewSchema } from "./types";

const reducers = {
  setInterview: (state: InterviewState, action: PayloadAction<InterviewSchema>) => {
    const { blocks, atoms, _id, project_id, title, stage } = action.payload;
    state.interview = { _id, project_id, title, stage };
    state.blocks = blocks;
    state.atoms = atoms;
  },
  setInterviewContent: (state: InterviewState, action: PayloadAction<InterviewContent>) => {
    state.blocks = action.payload.blocks;
    state.atoms = action.payload.atoms;
  },
  setTextBlock: (state: InterviewState, action: PayloadAction<TextBlockSchema>) => {
    const { _id } = action.payload;
    const index = state.blocks.findIndex((textblock) => textblock._id === _id);
    if (index > -1) {
      state.blocks[index] = action.payload;
    }
    // @TODO - rewrite with new hierarchy
  },
  setTextBlocks: (state: InterviewState, action: PayloadAction<TextBlockSchema[]>) => {
    action.payload.forEach((block) => {
      const index = state.blocks.findIndex((textBlock) => textBlock._id === block._id);
      if (index > -1) {
        const match = state.blocks[index];
        state.blocks[index] = {
          ...match,
          ...block,
        };
      }
    });
  },
  addTextBlock: (state: InterviewState) => {
    const order = state.blocks.length;
    const block: TextBlockSchema = {
      _id: `test_id ${Date.now()}`,
      interview_id: "interview_id",
      nodes: [],
      content: new Date().toString(),
      source: new Date().toString(),
      order,
    };
    // state.blocks[order - 1] = block;
    // state.blocks.push(block);
  },
  addAtom: (state: InterviewState, action: PayloadAction<AtomSchema>) => {
    const match = state.atoms.findIndex((a) => a._id === action.payload._id);
    if (match > -1) {
      state.atoms[match] = action.payload;
    } else {
      state.atoms.push(action.payload);
    }
  },
  deleteAtom: (state: InterviewState, action: PayloadAction<{ _id: string }>) => {
    const match = state.atoms.findIndex((a) => a._id === action.payload._id);
    if (match > -1) {
      state.atoms.splice(match, 1);
    }
  },
  resetInterview: (state: InterviewState, action: PayloadAction) => {
    state.fetching = false;
    state.blocks = initialState.blocks;
    state.atoms = initialState.atoms;
    state.interview = initialState.interview;
  },
  setFetching: (state: InterviewState, action: PayloadAction<boolean>) => {
    state.fetching = action.payload;
  },
};

export default reducers;
