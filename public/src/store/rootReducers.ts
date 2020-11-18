import {combineReducers} from 'redux';

import {IAnalysisState, analysisReducer} from './analysis';
import {IInterviewState, interviewsReducer} from './interviews';
import {IProjectsState, projectsReducer} from './projects';

export interface IAppState {
  analysisState: IAnalysisState;
  interviewsState: IInterviewState;
  projectsState: IProjectsState;
}

export const rootReducer = combineReducers<IAppState>({
  analysisState: analysisReducer,
  interviewsState: interviewsReducer,
  projectsState: projectsReducer,
});
