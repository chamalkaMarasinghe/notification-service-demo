import { createStore, combineReducers } from 'redux'
import { configureStore } from '@reduxjs/toolkit';
import { persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist'
import storage from 'redux-persist/lib/storage';

import notificationReducer from './reducers';
const rootReducer = combineReducers({notificationReducer})

const persistConfig = { key : 'root', storage, version : 1 }
const persistedReducer = persistReducer(persistConfig, rootReducer)

export const Store = configureStore({
    reducer : persistedReducer,
    middleware : (getDefaultMiddleware) => getDefaultMiddleware({serializableCheck:{ignoreActions : [ FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER]},}),
})
