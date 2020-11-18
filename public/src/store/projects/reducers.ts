import {Reducer} from 'redux';

import {AtomI} from 'routes/Analysis/interfaces';

import {IInterviewData} from '../interviews';
import {ProjectActions, ProjectActionTypes} from "./actions";

export interface IProjectsState {
  data: IProjectData[];
}

export interface IProjectData {
  _id: string;
  name: string;
  created: Date;
  interviews: IInterviewData[];
  atoms: AtomI[];
}

const initialProjectsState: IProjectsState = {
  data: [],
};

export const projectsReducer: Reducer<IProjectsState, ProjectActions> = (
  state = initialProjectsState,
  action
) => {
  const clone: IProjectsState = JSON.parse(JSON.stringify(state));
  switch (action.type) {
    case ProjectActionTypes.GET_PROJECTS: {
      clone.data = action.data;
      return clone;
    }
    default:
      return state;
  }
};
