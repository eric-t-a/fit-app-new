import { configureStore } from '@reduxjs/toolkit';
import rootReducer from './reducers'; // Create this file in the next section

const defaultMiddlewareConfig = {
  serializableCheck: false
};

const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
  getDefaultMiddleware(defaultMiddlewareConfig)
});

export default store;