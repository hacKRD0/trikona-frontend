// store.ts
import { combineReducers, configureStore, Middleware, isRejectedWithValue } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { persistReducer, persistStore, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import authReducer, { logout } from './slices/authSlice';
import directoryReducer from './slices/directorySlice';
import toastReducer, { showToast } from './slices/toastSlice';
import { authApi, directoryApi } from './services/index';
import passwordResetReducer from './slices/passwordResetSlice';

// Create your root reducer by combining all slice reducers.
const rootReducer = combineReducers({
  auth: authReducer,
  toast: toastReducer,
  [authApi.reducerPath]: authApi.reducer,
  passwordReset: passwordResetReducer,
  directory: directoryReducer,
  [directoryApi.reducerPath]: directoryApi.reducer,
});

// Configure redux-persist
const persistConfig = {
  key: 'root',
  storage,
  // Whitelist only the slices that should persist across refreshes
  whitelist: ['auth', 'passwordReset'],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

// Custom middleware to catch RTK Query errors (e.g., unauthorized errors)
interface ErrorPayload {
  status: number;
  data?: {
    error?: string;
  };
}

const rtkQueryErrorLogger: Middleware = (store) => (next) => (action) => {
  if (isRejectedWithValue(action)) {
    const payload = action.payload as ErrorPayload | undefined;
    const isLoginEndpoint = action?.meta?.arg?.endpointName?.includes('login') || false; 
    console.log('isLoginEndpoint', isLoginEndpoint);
    if (payload 
      && (payload.status === 401 || payload.status === 403)
      && !isLoginEndpoint) {
      store.dispatch(logout());
      store.dispatch(
        showToast({
          message: 'Session Expired! Please login again.',
          type: 'error',
        })
      );
    }
  }
  return next(action);
};

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
        // Only ignore redux-persist actions, not everything
      },
    }).concat(authApi.middleware, rtkQueryErrorLogger, directoryApi.middleware),
});

// Enable RTK Query's automatic re-fetching, etc.
setupListeners(store.dispatch);

// Create the persistor which will be used by PersistGate.
export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
