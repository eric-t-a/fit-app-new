import { createSlice } from '@reduxjs/toolkit';

const reducerName = "currentPosition";

const initialState = { latitude: 0, longitude: 0 };

const positionReducer = createSlice({
  name: reducerName,
  initialState,
  reducers: {
    setCurrentPosition: (state, { payload }) => {
        return payload;
    }
  },
});

export const { setCurrentPosition } = positionReducer.actions
export default positionReducer.reducer