import {ActionCreator, Dispatch} from 'redux';
import {ThunkAction} from 'redux-thunk';
import axios from 'axios';

import {AnalysisDataI, IAnalysisState} from './reducers';
import {AtomI, TextBlockI} from "routes/Analysis/interfaces";

export enum AnalysisActionTypes {
  SET_ANALYSIS_DATA = 'SET_ANALYSIS_DATA',
  SET_TEXT_BLOCK_DATA = 'SET_TEXT_BLOCK_DATA',
  SET_ATOM_DATA = 'SET_ATOM_DATA',
  CHANGE_ATOM_DATA = 'SET_ATOM_DATA',
  REMOVE_ATOM_DATA = 'REMOVE_ATOM_DATA',
  FETCH_DATA = 'FETCH_DATA',
}

export interface ISetAnalysisData {
  type: AnalysisActionTypes.SET_ANALYSIS_DATA;
  data: AnalysisDataI;
}

export interface IChangeAtomData {
  type: AnalysisActionTypes.SET_ATOM_DATA  | AnalysisActionTypes.REMOVE_ATOM_DATA | AnalysisActionTypes.CHANGE_ATOM_DATA;
  data: AtomI;
}


export interface IChangeBlockData {
  type: AnalysisActionTypes.SET_TEXT_BLOCK_DATA;
  data: TextBlockI;
}

export interface IFetchReport {
  type: AnalysisActionTypes.FETCH_DATA;
  isFetching: boolean;
}

export type ReportActions = ISetAnalysisData | IFetchReport | IChangeAtomData | IChangeBlockData;

export const getAnalysisData: ActionCreator<ThunkAction<Promise<any>, IAnalysisState, null, ISetAnalysisData>> = (id: string) => {
  return async (dispatch: Dispatch) => {
    try {
      const { data } = await axios({
        url: '/api/interviews/' + id,
        method: 'GET',
      });
      dispatch({ data, type: AnalysisActionTypes.SET_ANALYSIS_DATA });
    } catch (err) {
      console.error(err);
    }
  };
};

export const setAnalysisData: ActionCreator<ThunkAction<Promise<any>, IAnalysisState, null, ISetAnalysisData>> = (id: string, data: IAnalysisState) => {
  return async (dispatch: Dispatch) => {
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


export const changeBlock: ActionCreator<ThunkAction<Promise<any>, IAnalysisState, null, ISetAnalysisData>> = (data: TextBlockI) => {
  return async (dispatch: Dispatch) => {
    try {
      dispatch({ data, type: AnalysisActionTypes.SET_TEXT_BLOCK_DATA });
    } catch (err) {
      console.error(err);
    }
  };
};

export const changeAtom: ActionCreator<ThunkAction<Promise<any>, IAnalysisState, null, ISetAnalysisData>> = (data: AtomI) => {
  return async (dispatch: Dispatch) => {
    try {
      const res = await axios({
        url: '/api/atoms',
        method: 'OPTIONS',
        data
      });
      if (res.status === 201) {
        if (res.data.old) {
          dispatch({ data: res.data.old, type: AnalysisActionTypes.SET_ATOM_DATA });
        } else {
          data.deleted = true;
          dispatch({ data, type: AnalysisActionTypes.REMOVE_ATOM_DATA });
        }
        if (res.data.new) {
          dispatch({ data: res.data.new, type: AnalysisActionTypes.SET_ATOM_DATA });
        }
      }
      return res.data;
    } catch (err) {
      console.error(err);
    }
  };
};

export const addAtom: ActionCreator<ThunkAction<Promise<any>, IAnalysisState, null, ISetAnalysisData>> = (data: AtomI) => {
  return async (dispatch: Dispatch) => {
    // console.warn(data, add);
    try {
      const res = await axios({
        url: '/api/atoms',
        method: 'PUT',
        data
      });
      if (res.status === 201) dispatch({ data: res.data.data, type: AnalysisActionTypes.SET_ATOM_DATA });
      return res.data.data;
    } catch (err) {
      console.error(err);
    }
  };
};

export const deleteAtom: ActionCreator<ThunkAction<Promise<any>, IAnalysisState, null, ISetAnalysisData>> = (data: AtomI) => {
  return async (dispatch: Dispatch) => {
    // console.warn(data, add);
    try {
      const res = await axios({
        url: '/api/atoms',
        method: 'DELETE',
        data
      });
      dispatch({ data: res.data, type: AnalysisActionTypes.REMOVE_ATOM_DATA });
      return res.data;
    } catch (err) {
      console.error(err);
    }
  };
};