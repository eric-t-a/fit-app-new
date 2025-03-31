import { createSlice } from '@reduxjs/toolkit';
import { LatLng } from 'react-native-maps';

const reducerName = "runningInfo";

export interface RunningInfo {
  isRunning: boolean;
  start_time: null | Date;
  end_time: null | Date;
  calories: number;
  coordinates: Coordinates[];
  distance: number; // meters
  pace: string;
}
export interface Coordinates extends LatLng {
  time: Date;
}

const initialState : RunningInfo = { isRunning: false, start_time: null, end_time: null, calories: 0, coordinates: [], distance: 0, pace: '00:00' };

const runningReducer = createSlice({
  name: reducerName,
  initialState,
  reducers: {
    setActiveRunningState: (state, { payload }) => {
      return payload;
    }
  },
});

export const { setActiveRunningState } = runningReducer.actions
export default runningReducer.reducer