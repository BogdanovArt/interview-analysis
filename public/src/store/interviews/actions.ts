import {ActionCreator, Dispatch} from 'redux';
import {ThunkAction} from 'redux-thunk';
import axios from 'axios';

import {IInterviewState} from './reducers';
import {AnalysisDataI} from '../analysis';

export enum InterviewActionTypes {
  GET_INTERVIEWS_DATA = 'GET_INTERVIEWS_DATA',
  DELETE_INTERVIEW = 'DELETE_INTERVIEW',
  FETCH_DATA = 'FETCH_DATA',
}

export interface IDeleteInterview {
  type: InterviewActionTypes.DELETE_INTERVIEW;
  id: string;
}

export interface IGetInterviewsData {
  type: InterviewActionTypes.GET_INTERVIEWS_DATA;
  data: IInterviewState;
}

export interface IFetchData {
  type: InterviewActionTypes.FETCH_DATA;
  isFetching: boolean;
}

export type InterviewActions = IGetInterviewsData | IFetchData | IDeleteInterview;

export const getInterviewsData: ActionCreator<ThunkAction<Promise<any>, IInterviewState, null, IGetInterviewsData>> = (id: string) => {
  return async (dispatch: Dispatch) => {
    try {
      const { data } = await axios.get('/api/projects/' + id);
      dispatch({ data, type: InterviewActionTypes.GET_INTERVIEWS_DATA });
    } catch (err) {
      console.error(err);
    }
  };
};

export const deleteInterview: ActionCreator<ThunkAction<Promise<any>, IInterviewState, null, IDeleteInterview>> = (id: string) => {
  return async () => {
    try {
      await axios({
        url: '/api/interviews',
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

export const changeInterview: ActionCreator<ThunkAction<Promise<any>, IInterviewState, null, IDeleteInterview>> = (id: string, data: any) => {
  return async () => {
    try {
      await axios({
        url: '/api/interviews/' + id,
        method: 'PUT',
        data
      });
    } catch (err) {
      console.error(err);
    }
  };
};

export const createInterview: ActionCreator<ThunkAction<Promise<any>, IInterviewState, null, IDeleteInterview>> = (
  { project_id, title, content}:
  { project_id: string; title: string; content: AnalysisDataI }
) => {
  return async () => {
    return axios({
      url: '/api/interviews',
      method: 'PUT',
      data: {
        title,
        content,
        project_id
      }
    });
  };
};