import {Reducer} from 'redux';
import {AnalysisActionTypes, ReportActions,} from './actions';
import {AtomI, TextBlockI} from 'routes/Analysis/interfaces';
import {IProjectData} from 'store/projects';

export interface AnalysisDataI {
  blocks: TextBlockI[];
  atoms: AtomI[];
}
export interface IAnalysisState {
  _id?: string;
  title?: string;
  content: AnalysisDataI;
  project_id?: IProjectData;
}

const initialReportState: IAnalysisState = {
  content: {
    blocks: [],
    atoms: []
  },
};

export const analysisReducer: Reducer<IAnalysisState, ReportActions> = (
  state = initialReportState,
  action
) => {
  const clone: IAnalysisState = JSON.parse(JSON.stringify(state));
  switch (action.type) {
    case AnalysisActionTypes.SET_ANALYSIS_DATA: {
      return {
        ...clone,
        ...action.data
      };
    }
    case AnalysisActionTypes.SET_ATOM_DATA: {
      const existing = clone.content.atoms.findIndex((atom: AtomI) => atom._id === action.data._id);
      if (existing !== -1) {
        clone.content.atoms[existing] = action.data;
      } else {
        clone.content.atoms.push(action.data);
      }
      return { ...clone };
    }
    case AnalysisActionTypes.REMOVE_ATOM_DATA: {
      if (action.data.deleted) {
        const index = clone.content.atoms.findIndex((el) => el._id === action.data._id);
        clone.content.atoms.splice(index, 1);
      }
      return { ...clone };
    }
    case AnalysisActionTypes.SET_TEXT_BLOCK_DATA: {
      const id = action.data.id as number;
      clone.content.blocks[id] = action.data;
      return { ...clone };
    }
    case AnalysisActionTypes.FETCH_DATA: {
      return {
        ...state,
        isFetching: action.isFetching
      }
    }
    default:
      return state;
  }
};
