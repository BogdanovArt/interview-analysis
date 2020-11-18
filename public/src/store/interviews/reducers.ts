import {Reducer} from 'redux';
import {InterviewActions, InterviewActionTypes} from './actions';
import {AnalysisDataI} from '../analysis';

export interface IInterviewState {
  _id?:  string;
  name?: string;
  created?: Date;
  project_id?: string;
  interviews: IInterviewData[];
}

export interface IInterviewData {
  _id?: string;
  date?: string;
  title?: string;
  content: AnalysisDataI;
}

const initialInterviewsState: IInterviewState = {
  interviews: [],
};

export const interviewsReducer: Reducer<IInterviewState, InterviewActions> = (
  state = initialInterviewsState,
  action
) => {
  switch (action.type) {
    case InterviewActionTypes.GET_INTERVIEWS_DATA: {
      return action.data;
    }
    default:
      return state;
  }
};
