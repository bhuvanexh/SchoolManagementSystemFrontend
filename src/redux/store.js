import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

import { attachStore } from './axiosClient';
import authReducer from './slices/authSlice';
import classReducer from './slices/classSlice';
import coreSubjectReducer from './slices/coreSubjectSlice';
import dashboardReducer from './slices/dashboardSlice';
import eventReducer from './slices/eventSlice';
import noticeReducer from './slices/noticeSlice';
import notificationReducer from './slices/notificationSlice';
import resultReducer from './slices/resultSlice';
import sectionReducer from './slices/sectionSlice';
import studentReducer from './slices/studentSlice';
import subjectReducer from './slices/subjectSlice';
import syllabusReducer from './slices/syllabusSlice';
import teacherReducer from './slices/teacherSlice';
import testReducer from './slices/testSlice';
import attendanceReducer from './slices/attendanceSlice';

const persistConfig = {
  key: 'sms',
  storage,
  whitelist: ['auth'],
};

const rootReducer = combineReducers({
  auth: authReducer,
  attendance: attendanceReducer,
  classes: classReducer,
  coreSubjects: coreSubjectReducer,
  dashboard: dashboardReducer,
  events: eventReducer,
  notices: noticeReducer,
  notifications: notificationReducer,
  results: resultReducer,
  sections: sectionReducer,
  students: studentReducer,
  subjects: subjectReducer,
  syllabus: syllabusReducer,
  teachers: teacherReducer,
  tests: testReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

attachStore(store);

export const persistor = persistStore(store);
