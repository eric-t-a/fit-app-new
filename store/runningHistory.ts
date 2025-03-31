import { createSlice } from '@reduxjs/toolkit';
import { LatLng } from 'react-native-maps';
import { RunningInfo } from './runningInfo';
import { getData } from '../utils/storage';

const reducerName = "runningHistory";


const initialState : RunningInfo[] = [];

const runningHistoryReducer = createSlice({
  name: reducerName,
  initialState,
  reducers: {
    setHistoryState: (state, { payload }) => {
      return payload;
    }

  },
});

export const { setHistoryState } = runningHistoryReducer.actions
export default runningHistoryReducer.reducer