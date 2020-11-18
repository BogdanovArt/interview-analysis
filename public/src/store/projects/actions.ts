import {ActionCreator, Dispatch} from 'redux';
import {ThunkAction} from 'redux-thunk';
import axios from 'axios';

import {IProjectData, IProjectsState} from './reducers';

export enum ProjectActionTypes {
  GET_PROJECTS = 'GET_PROJECTS',
  ADD_PROJECT = 'ADD_PROJECT',
  DELETE_PROJECT = 'DELETE_PROJECT',
  CHANGE_PROJECT = 'CHANGE_PROJECT',
  FETCHING = 'FETCHING',
}

export interface IAddProject {
  type: ProjectActionTypes.ADD_PROJECT;
  name: string;
}

export interface IDeleteProject {
  type: ProjectActionTypes.DELETE_PROJECT;
  id: string;
}

export interface IChangeProject {
  type: ProjectActionTypes.CHANGE_PROJECT;
  id: string;
}

export interface IGetProjectData {
  type: ProjectActionTypes.GET_PROJECTS;
  data: IProjectData[];
}

export interface IFetching {
  type: ProjectActionTypes.FETCHING;
  isFetching: boolean;
}

export type ProjectActions = IGetProjectData | IFetching | IDeleteProject | IChangeProject;

export const getProjectsData: ActionCreator<ThunkAction<Promise<any>, IProjectsState, null, IGetProjectData>> = () => {
  return async (dispatch: Dispatch) => {
    try {
      const { data } = await axios.get('/api/projects');
      dispatch({ data, type: ProjectActionTypes.GET_PROJECTS });
    } catch (err) {
      console.error(err);
    }
  };
};

export const deleteProject: ActionCreator<ThunkAction<Promise<any>, IProjectsState, null, IDeleteProject>> = (id: string) => {
  return async () => {
    try {
      await axios({
        url: '/api/projects',
        method: 'DELETE',
        data: {
          id
        }
      });
    } catch (err) {
      console.error(err);
    }
  };
};

export const changeProject: ActionCreator<ThunkAction<Promise<any>, IProjectsState, null, IChangeProject>> = (id: string, name: string) => {
  return async () => {
    try {
      await axios({
        url: '/api/projects/' + id,
        method: 'PUT',
        data: {
          id,
          name
        }
      });
    } catch (err) {
      console.error(err);
    }
  };
};

export const addProject: ActionCreator<ThunkAction<Promise<any>, IProjectsState, null, IAddProject>> = (name: string) => {
  return async () => {
    return axios({
      url: '/api/projects',
      method: 'PUT',
      data: {
        name
      }
    });
  };
};