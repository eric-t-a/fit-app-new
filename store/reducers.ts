// reducers.js
import { combineReducers } from 'redux';
import positionReducer from './position';
import runningReducer from './runningInfo';
import runningHistoryReducer from './runningHistory';

const rootReducer = combineReducers({
  currentPosition: positionReducer,
  runningInfo: runningReducer,
  runningHistory: runningHistoryReducer
});

export default rootReducer;