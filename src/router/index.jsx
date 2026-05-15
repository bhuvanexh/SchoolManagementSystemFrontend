import { Suspense, lazy } from 'react';
import { createBrowserRouter } from 'react-router-dom';

import Loader from '../components/feedback/Loader';
import MainLayout from '../components/layout/MainLayout';
import ProtectedRoute from './ProtectedRoute';
import RoleRoute from './RoleRoute';

const lazyPage = (importer) => {
  const Component = lazy(importer);

  return (
    <Suspense fallback={<Loader />}>
      <Component />
    </Suspense>
  );
};

export const router = createBrowserRouter([
  {
    path: '/login',
    element: lazyPage(() => import('../pages/auth/Login')),
  },
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <MainLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        handle: { title: 'Dashboard' },
        element: lazyPage(() => import('../pages/dashboard')),
      },
      {
        path: 'change-password',
        handle: { title: 'Change Password' },
        element: lazyPage(() => import('../pages/auth/ChangePassword')),
      },
      {
        element: <RoleRoute allowed={['admin']} />,
        children: [
          {
            path: 'teachers',
            handle: { title: 'Teachers' },
            element: lazyPage(() => import('../pages/teachers')),
          },
          {
            path: 'teachers/new',
            handle: { title: 'Add Teacher' },
            element: lazyPage(() => import('../pages/teachers/TeacherForm')),
          },
          {
            path: 'teachers/:id',
            handle: { title: 'Teacher Detail' },
            element: lazyPage(() => import('../pages/teachers/TeacherDetail')),
          },
          {
            path: 'teachers/:id/edit',
            handle: { title: 'Edit Teacher' },
            element: lazyPage(() => import('../pages/teachers/TeacherForm')),
          },
          {
            path: 'core-subjects',
            handle: { title: 'Core Subjects' },
            element: lazyPage(() => import('../pages/coreSubjects')),
          },
          {
            path: 'classes/new',
            handle: { title: 'Add Class' },
            element: lazyPage(() => import('../pages/classes/ClassForm')),
          },
          {
            path: 'classes/:id/edit',
            handle: { title: 'Edit Class' },
            element: lazyPage(() => import('../pages/classes/ClassForm')),
          },
        ],
      },
      {
        element: <RoleRoute allowed={['admin', 'teacher']} />,
        children: [
          {
            path: 'classes',
            handle: { title: 'Classes' },
            element: lazyPage(() => import('../pages/classes')),
          },
          {
            path: 'classes/:id',
            handle: { title: 'Class Detail' },
            element: lazyPage(() => import('../pages/classes/ClassDetail')),
          },
          {
            path: 'students',
            handle: { title: 'Students' },
            element: lazyPage(() => import('../pages/students')),
          },
          {
            path: 'students/new',
            handle: { title: 'Add Student' },
            element: lazyPage(() => import('../pages/students/StudentForm')),
          },
          {
            path: 'students/:id/edit',
            handle: { title: 'Edit Student' },
            element: lazyPage(() => import('../pages/students/StudentForm')),
          },
          {
            path: 'subjects',
            handle: { title: 'Subjects' },
            element: lazyPage(() => import('../pages/subjects')),
          },
          {
            path: 'subjects/new',
            handle: { title: 'Add Subject' },
            element: lazyPage(() => import('../pages/subjects/SubjectForm')),
          },
          {
            path: 'subjects/:id/edit',
            handle: { title: 'Edit Subject' },
            element: lazyPage(() => import('../pages/subjects/SubjectForm')),
          },
          {
            path: 'attendance',
            handle: { title: 'Attendance' },
            element: lazyPage(() => import('../pages/attendance')),
          },
          {
            path: 'tests/new',
            handle: { title: 'Create Test' },
            element: lazyPage(() => import('../pages/tests/TestForm')),
          },
          {
            path: 'tests/:id',
            handle: { title: 'Edit Test' },
            element: lazyPage(() => import('../pages/tests/TestForm')),
          },
          {
            path: 'tests/:id/grade',
            handle: { title: 'Grade Test' },
            element: lazyPage(() => import('../pages/tests/components/GradingSheet')),
          },
          {
            path: 'notices/new',
            handle: { title: 'Create Notice' },
            element: lazyPage(() => import('../pages/notices/NoticeForm')),
          },
          {
            path: 'notices/:id/edit',
            handle: { title: 'Edit Notice' },
            element: lazyPage(() => import('../pages/notices/NoticeForm')),
          },
          {
            path: 'events/new',
            handle: { title: 'Create Event' },
            element: lazyPage(() => import('../pages/events/EventForm')),
          },
          {
            path: 'events/:id/edit',
            handle: { title: 'Edit Event' },
            element: lazyPage(() => import('../pages/events/EventForm')),
          },
        ],
      },
      {
        element: <RoleRoute allowed={['admin', 'teacher', 'student']} />,
        children: [
          {
            path: 'students/:id',
            handle: { title: 'Student Detail' },
            element: lazyPage(() => import('../pages/students/StudentDetail')),
          },
          {
            path: 'students/me',
            handle: { title: 'My Profile' },
            element: lazyPage(() => import('../pages/students/StudentDetail')),
          },
          {
            path: 'syllabus',
            handle: { title: 'Syllabus' },
            element: lazyPage(() => import('../pages/syllabus')),
          },
          {
            path: 'tests',
            handle: { title: 'Tests & Results' },
            element: lazyPage(() => import('../pages/tests')),
          },
          {
            path: 'notices',
            handle: { title: 'Notices' },
            element: lazyPage(() => import('../pages/notices')),
          },
          {
            path: 'events',
            handle: { title: 'Events' },
            element: lazyPage(() => import('../pages/events')),
          },
        ],
      },
    ],
  },
]);
