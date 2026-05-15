# SMS Frontend — Architecture & Best Practices
**Framework:** React 19 (Vite)
**Language:** JavaScript / JSX only — no TypeScript
**Styling:** Tailwind CSS (primary) + custom CSS for glassmorphism tokens
**State:** Redux Toolkit + Redux Persist (auth only)
**Forms:** React Hook Form + Yup
**Routing:** React Router DOM v6

> Every contributor and AI agent working on this codebase must follow these conventions.
> Also read: `PRODUCT.md` (business rules), `BACKEND_SCAFFOLD.md` (API endpoints).

---

## 1. Folder Structure

```
frontend/
├── public/
│   └── favicon.ico
├── src/
│   ├── assets/                     # Static images, icons, fonts
│   │   ├── images/
│   │   └── fonts/
│   │
│   ├── components/                 # Shared, reusable, feature-agnostic UI
│   │   ├── buttons/
│   │   │   ├── PrimaryButton.jsx
│   │   │   ├── SecondaryButton.jsx
│   │   │   └── IconButton.jsx
│   │   ├── inputs/
│   │   │   ├── TextInput.jsx
│   │   │   ├── SelectInput.jsx
│   │   │   ├── SearchInput.jsx
│   │   │   ├── DateInput.jsx
│   │   │   └── FileInput.jsx
│   │   ├── feedback/
│   │   │   ├── Loader.jsx
│   │   │   ├── EmptyState.jsx
│   │   │   ├── ErrorState.jsx
│   │   │   └── ConfirmDialog.jsx
│   │   ├── layout/
│   │   │   ├── Sidebar.jsx
│   │   │   ├── TopBar.jsx
│   │   │   ├── PageHeader.jsx
│   │   │   ├── PageWrapper.jsx
│   │   │   └── MainLayout.jsx
│   │   ├── data-display/
│   │   │   ├── StatCard.jsx
│   │   │   ├── Badge.jsx
│   │   │   ├── DataTable.jsx      # TanStack Table wrapper
│   │   │   └── Avatar.jsx
│   │   ├── modal/
│   │   │   └── Modal.jsx
│   │   └── form/
│   │       ├── FormWrapper.jsx     # Wraps react-hook-form provider
│   │       ├── FormField.jsx       # Controller-based field wrapper
│   │       └── FormSection.jsx     # Visual grouping for form fields
│   │
│   ├── pages/                      # Route-level feature modules
│   │   ├── auth/
│   │   │   ├── Login.jsx
│   │   │   └── ChangePassword.jsx
│   │   ├── dashboard/
│   │   │   ├── index.jsx
│   │   │   └── components/         # Feature-local UI
│   │   │       ├── AdminDashboard.jsx
│   │   │       ├── TeacherDashboard.jsx
│   │   │       └── StudentDashboard.jsx
│   │   ├── teachers/
│   │   │   ├── index.jsx           # Teacher listing
│   │   │   ├── TeacherForm.jsx     # Create + Edit (shared)
│   │   │   ├── TeacherDetail.jsx
│   │   │   └── components/
│   │   ├── classes/
│   │   │   ├── index.jsx
│   │   │   ├── ClassForm.jsx
│   │   │   ├── ClassDetail.jsx     # Hub: sections, students, subjects
│   │   │   └── components/
│   │   │       ├── SectionList.jsx
│   │   │       ├── SectionForm.jsx
│   │   │       └── ClassTeacherAssign.jsx
│   │   ├── students/
│   │   │   ├── index.jsx
│   │   │   ├── StudentForm.jsx
│   │   │   ├── StudentDetail.jsx   # Profile + tabs (attendance, results)
│   │   │   └── components/
│   │   ├── subjects/
│   │   │   ├── index.jsx
│   │   │   ├── SubjectForm.jsx
│   │   │   └── components/
│   │   ├── coreSubjects/
│   │   │   └── index.jsx           # Simple CRUD — no separate form page
│   │   ├── attendance/
│   │   │   ├── index.jsx           # Mark attendance view
│   │   │   └── components/
│   │   │       ├── AttendanceSheet.jsx
│   │   │       └── AttendanceReport.jsx
│   │   ├── syllabus/
│   │   │   ├── index.jsx
│   │   │   └── components/
│   │   │       ├── SyllabusList.jsx
│   │   │       └── SyllabusItemForm.jsx
│   │   ├── tests/
│   │   │   ├── index.jsx
│   │   │   ├── TestForm.jsx
│   │   │   └── components/
│   │   │       ├── GradingSheet.jsx
│   │   │       └── ResultView.jsx
│   │   ├── notices/
│   │   │   ├── index.jsx
│   │   │   ├── NoticeForm.jsx
│   │   │   └── components/
│   │   ├── events/
│   │   │   ├── index.jsx
│   │   │   ├── EventForm.jsx
│   │   │   └── components/
│   │   └── notifications/
│   │       └── components/
│   │           └── NotificationDropdown.jsx
│   │
│   ├── redux/
│   │   ├── store.js                # configureStore + persistConfig
│   │   ├── axiosClient.js          # Shared Axios instance + interceptors
│   │   ├── actions/                # Async thunks only
│   │   │   ├── authActions.js
│   │   │   ├── teacherActions.js
│   │   │   ├── classActions.js
│   │   │   ├── sectionActions.js
│   │   │   ├── studentActions.js
│   │   │   ├── subjectActions.js
│   │   │   ├── coreSubjectActions.js
│   │   │   ├── attendanceActions.js
│   │   │   ├── syllabusActions.js
│   │   │   ├── testActions.js
│   │   │   ├── resultActions.js
│   │   │   ├── noticeActions.js
│   │   │   ├── eventActions.js
│   │   │   ├── notificationActions.js
│   │   │   └── dashboardActions.js
│   │   └── slices/                 # Reducers + state shape
│   │       ├── authSlice.js
│   │       ├── teacherSlice.js
│   │       ├── classSlice.js
│   │       ├── sectionSlice.js
│   │       ├── studentSlice.js
│   │       ├── subjectSlice.js
│   │       ├── coreSubjectSlice.js
│   │       ├── attendanceSlice.js
│   │       ├── syllabusSlice.js
│   │       ├── testSlice.js
│   │       ├── resultSlice.js
│   │       ├── noticeSlice.js
│   │       ├── eventSlice.js
│   │       ├── notificationSlice.js
│   │       └── dashboardSlice.js
│   │
│   ├── router/
│   │   ├── index.jsx               # All route definitions
│   │   ├── ProtectedRoute.jsx      # Auth guard wrapper
│   │   └── RoleRoute.jsx           # Role-based access guard
│   │
│   ├── validation/                 # Yup schemas
│   │   ├── authSchema.js
│   │   ├── teacherSchema.js
│   │   ├── classSchema.js
│   │   ├── studentSchema.js
│   │   ├── subjectSchema.js
│   │   ├── attendanceSchema.js
│   │   ├── testSchema.js
│   │   ├── noticeSchema.js
│   │   ├── eventSchema.js
│   │   └── commonRules.js          # Shared: email, phone, required, etc.
│   │
│   ├── hooks/                      # Custom React hooks
│   │   ├── useAuth.js              # Current user + role checks
│   │   ├── usePermission.js        # Permission guard helper
│   │   └── useDebounce.js          # Search debouncing
│   │
│   ├── utils/
│   │   ├── constants.js            # Roles, statuses, nav items
│   │   ├── formatters.js           # Date, percentage, name formatters
│   │   ├── helpers.js              # Generic pure helpers
│   │   └── roleNavConfig.js        # Sidebar nav items per role
│   │
│   ├── css/
│   │   └── global.css              # Tailwind directives + glass tokens + custom scrollbar
│   │
│   ├── App.jsx
│   └── main.jsx
│
├── index.html
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
├── .env
├── .env.example
└── package.json
```

---

## 2. Design System — Tailwind Config & Glass Tokens

### `tailwind.config.js`

```js
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Manrope', 'Inter', 'sans-serif'],
      },
      colors: {
        primary: {
          DEFAULT: '#231f74',
          container: '#3a388b',
          light: 'rgba(35, 31, 116, 0.15)',
        },
        secondary: {
          DEFAULT: '#006c49',
          container: '#6cf8bb',
        },
        tertiary: {
          DEFAULT: '#003421',
          container: '#004d33',
        },
        surface: {
          DEFAULT: '#f8f9fc',
          container: '#eceef0',
          'container-low': 'rgba(255, 255, 255, 0.5)',
        },
        error: {
          DEFAULT: '#ba1a1a',
          container: '#ffdad6',
        },
        'on-surface': '#191c1e',
        'on-surface-variant': '#464651',
        outline: '#777682',
      },
      borderRadius: {
        glass: '24px',
        'glass-sm': '16px',
        'glass-xs': '12px',
      },
      boxShadow: {
        glass: '0 24px 80px rgba(25, 28, 30, 0.04)',
        'glass-md': '0 12px 40px rgba(25, 28, 30, 0.03)',
        'primary-glow': '0 20px 60px rgba(35, 31, 116, 0.25)',
        'primary-glow-sm': '0 12px 30px rgba(35, 31, 116, 0.25)',
        'primary-glow-xs': '0 8px 20px rgba(35, 31, 116, 0.2)',
      },
      backdropBlur: {
        glass: '24px',
        'glass-sm': '12px',
        'glass-xs': '8px',
      },
    },
  },
  plugins: [],
};
```

### `src/css/global.css`

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@import url('https://fonts.googleapis.com/css2?family=Manrope:wght@200;300;400;500;600;700;800&display=swap');

@layer components {
  /* Glass Panel — the core card style */
  .glass-panel {
    @apply bg-white/70 backdrop-blur-glass border border-white/40 rounded-glass shadow-glass;
  }
  .glass-panel-sm {
    @apply bg-white/70 backdrop-blur-glass-sm border border-white/40 rounded-glass-sm shadow-glass-md;
  }

  /* Mesh Background — main content area */
  .mesh-bg {
    background-color: #f8f9fc;
    background-image:
      radial-gradient(ellipse at top left, rgba(58, 56, 139, 0.15), transparent 50%),
      radial-gradient(ellipse at top right, rgba(0, 108, 73, 0.10), transparent 50%),
      radial-gradient(ellipse at bottom right, rgba(58, 56, 139, 0.10), transparent 50%),
      radial-gradient(ellipse at bottom left, rgba(111, 251, 190, 0.15), transparent 50%);
  }

  /* Primary Button */
  .btn-primary {
    @apply bg-gradient-to-r from-primary to-primary-container text-white font-bold
           uppercase text-xs tracking-wider px-6 py-3 rounded-full shadow-primary-glow-sm
           hover:scale-105 active:scale-95 transition-transform duration-200
           disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100;
  }

  /* Secondary Button */
  .btn-secondary {
    @apply bg-surface-container text-on-surface font-semibold
           text-xs tracking-wider px-6 py-3 rounded-full
           hover:bg-surface border border-outline/20
           active:scale-95 transition-all duration-200
           disabled:opacity-50 disabled:cursor-not-allowed;
  }

  /* Input Field */
  .input-field {
    @apply bg-surface-container-low border-none rounded-glass-xs px-4 py-3
           text-on-surface placeholder-gray-400
           focus:ring-2 focus:ring-primary-light focus:bg-white
           transition-all duration-200 w-full outline-none;
  }

  /* Custom Scrollbar */
  .custom-scrollbar::-webkit-scrollbar { width: 4px; }
  .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
  .custom-scrollbar::-webkit-scrollbar-thumb {
    background: rgba(35, 31, 116, 0.15);
    border-radius: 9999px;
  }
  .custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background: rgba(35, 31, 116, 0.3);
  }
}
```

---

## 3. Axios Client (`src/redux/axiosClient.js`)

Single Axios instance. All API calls go through this. JWT is attached automatically.

```js
import axios from 'axios';
import toast from 'react-hot-toast';
import { store } from './store';
import { logout } from './slices/authSlice';

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1',
  headers: { 'Content-Type': 'application/json' },
});

// Attach token on every request
axiosClient.interceptors.request.use((config) => {
  const token = store.getState().auth.token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Global response error handler
axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const message = error.response?.data?.message || 'Something went wrong';

    if (status === 401) {
      store.dispatch(logout());
      toast.error('Session expired. Please log in again.');
      window.location.href = '/login';
    } else if (status === 403) {
      toast.error('You do not have permission to perform this action.');
    }

    return Promise.reject(error);
  }
);

export default axiosClient;
```

---

## 4. Redux Pattern

### Store Setup (`src/redux/store.js`)

```js
import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

import authReducer from './slices/authSlice';
// ... import all slices

const persistConfig = {
  key: 'sms',
  storage,
  whitelist: ['auth'], // ONLY persist auth (token + user)
};

const rootReducer = combineReducers({
  auth: authReducer,
  teachers: teacherReducer,
  // ... all other slices
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }),
});

export const persistor = persistStore(store);
```

### Thunk Pattern (every action file follows this)

```js
import { createAsyncThunk } from '@reduxjs/toolkit';
import axiosClient from '../axiosClient';
import toast from 'react-hot-toast';

export const fetchTeachers = createAsyncThunk(
  'teachers/fetchAll',
  async (params, { rejectWithValue }) => {
    try {
      const res = await axiosClient.get('/teachers', { params });
      return res.data.data;
    } catch (error) {
      const msg = error.response?.data?.message || 'Failed to fetch teachers';
      toast.error(msg);
      return rejectWithValue(msg);
    }
  }
);
```

### Slice Pattern (every slice follows this)

```js
import { createSlice } from '@reduxjs/toolkit';
import { fetchTeachers, createTeacher } from '../actions/teacherActions';

const initialState = {
  list: [],
  current: null,
  loading: false,
  error: null,
};

const teacherSlice = createSlice({
  name: 'teachers',
  initialState,
  reducers: {
    clearCurrentTeacher: (state) => { state.current = null; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTeachers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTeachers.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchTeachers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
    // ... repeat for other thunks
  },
});

export const { clearCurrentTeacher } = teacherSlice.actions;
export default teacherSlice.reducer;
```

---

## 5. Form Pattern (React Hook Form + Yup)

### Validation Schema (`src/validation/teacherSchema.js`)

```js
import * as yup from 'yup';
import { emailRule, phoneRule, requiredString } from './commonRules';

export const teacherSchema = yup.object().shape({
  name: requiredString('Full name'),
  email: emailRule,
  phone: phoneRule,
  coreSubjects: yup.array().min(1, 'Select at least one core subject').required(),
  qualification: yup.string().nullable(),
  experience: yup.string().nullable(),
  address: yup.string().nullable(),
  notes: yup.string().nullable(),
});
```

### Common Rules (`src/validation/commonRules.js`)

```js
import * as yup from 'yup';

export const requiredString = (label) =>
  yup.string().trim().required(`${label} is required`);

export const emailRule = yup
  .string()
  .trim()
  .email('Enter a valid email')
  .required('Email is required');

export const phoneRule = yup
  .string()
  .trim()
  .matches(/^[6-9]\d{9}$/, 'Enter a valid 10-digit phone number')
  .required('Phone number is required');

export const rollNumberRule = yup
  .string()
  .trim()
  .required('Roll number is required');

export const dateRule = (label) =>
  yup.date().typeError(`Enter a valid ${label}`).required(`${label} is required`);
```

### Form in Component

```js
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { teacherSchema } from '../../validation/teacherSchema';

const TeacherForm = ({ defaultValues, onSubmit, loading }) => {
  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm({
    resolver: yupResolver(teacherSchema),
    defaultValues: defaultValues || {},
    mode: 'onChange', // ALWAYS onChange — real-time validation
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <FormField control={control} name="name" label="Full Name" error={errors.name} />
      <FormField control={control} name="email" label="Email" error={errors.email} />
      {/* ... more fields */}

      <button type="submit" className="btn-primary" disabled={!isValid || loading}>
        {loading ? 'Saving...' : 'Save'}
      </button>
    </form>
  );
};
```

---

## 6. Routing & Guards

### Route Definitions (`src/router/index.jsx`)

```js
import { lazy, Suspense } from 'react';
import { createBrowserRouter } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import RoleRoute from './RoleRoute';
import MainLayout from '../components/layout/MainLayout';
import Loader from '../components/feedback/Loader';

const lazyLoad = (importFn) => {
  const Component = lazy(importFn);
  return (
    <Suspense fallback={<Loader />}>
      <Component />
    </Suspense>
  );
};

export const router = createBrowserRouter([
  { path: '/login', element: lazyLoad(() => import('../pages/auth/Login')) },
  {
    path: '/',
    element: <ProtectedRoute><MainLayout /></ProtectedRoute>,
    children: [
      { index: true, element: lazyLoad(() => import('../pages/dashboard')) },
      // Admin-only routes
      {
        element: <RoleRoute allowed={['admin']} />,
        children: [
          { path: 'teachers', element: lazyLoad(() => import('../pages/teachers')) },
          { path: 'teachers/new', element: lazyLoad(() => import('../pages/teachers/TeacherForm')) },
          // ... more admin routes
        ],
      },
      // Admin + Teacher routes
      {
        element: <RoleRoute allowed={['admin', 'teacher']} />,
        children: [
          { path: 'students', element: lazyLoad(() => import('../pages/students')) },
          // ...
        ],
      },
      // All roles
      { path: 'change-password', element: lazyLoad(() => import('../pages/auth/ChangePassword')) },
    ],
  },
]);
```

### ProtectedRoute

```js
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const ProtectedRoute = ({ children }) => {
  const { token } = useSelector((state) => state.auth);
  if (!token) return <Navigate to="/login" replace />;
  return children;
};
```

### RoleRoute

```js
import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';

const RoleRoute = ({ allowed }) => {
  const { user } = useSelector((state) => state.auth);
  if (!allowed.includes(user?.role)) return <Navigate to="/" replace />;
  return <Outlet />;
};
```

---

## 7. Shared Component Contracts

### `FormField.jsx` — Universal Field Wrapper
Every form field in the app uses this. Renders label, input, error message.

```js
import { Controller } from 'react-hook-form';

const FormField = ({ control, name, label, type = 'text', error, placeholder, ...rest }) => (
  <div className="flex flex-col gap-1.5">
    {label && (
      <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">
        {label}
      </label>
    )}
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <input
          {...field}
          type={type}
          placeholder={placeholder || label}
          className="input-field"
          {...rest}
        />
      )}
    />
    {error && <span className="text-xs text-error font-medium">{error.message}</span>}
  </div>
);
```

### `DataTable.jsx` — TanStack Table Wrapper
Wraps `@tanstack/react-table` with consistent glass styling. Accepts `columns` and `data` props.

### `StatCard.jsx`
```
Props: icon, value, label, subtitle, color ('primary' | 'secondary' | 'tertiary' | 'error')
```

### `ConfirmDialog.jsx`
```
Props: isOpen, title, message, onConfirm, onCancel, confirmText, loading
```
Used for: deactivation, deletion, class teacher reassignment warning.

---

## 8. Core Rules (Non-Negotiable)

### DO

- New route features → `src/pages/<feature>/`
- Shared UI primitives → `src/components/`
- Feature-local UI → `src/pages/<feature>/components/`
- API calls → Redux thunks in `src/redux/actions/`
- Global state → matching slice in `src/redux/slices/`
- Register routes → `src/router/index.jsx`
- Validation schemas → `src/validation/`
- **Always reuse existing field components** — check `src/components/` before creating
- **All forms use `mode: 'onChange'`** — real-time validation
- **All submit buttons are `disabled={!isValid || loading}`**
- **Use `react-hot-toast`** for all success/error feedback
- **Use `ConfirmDialog`** for all destructive actions

### DO NOT

- Put API logic in components — it goes in Redux thunks
- Use TypeScript — JS/JSX only, always
- Use React Context for data already in Redux
- Push transient UI state (modal open, collapse) into Redux
- Inline Yup schemas inside JSX files
- Duplicate components that exist in `src/components/`
- Add comments explaining WHAT the code does — only explain non-obvious WHY
- Use MUI for anything except icons (use `@mui/icons-material` if needed, or Material Symbols via CDN)
- Use `useEffect` for derived state — use `useMemo` instead
- Fetch the same data twice in nested effects

### Naming Conventions

| Item | Convention | Example |
|---|---|---|
| Components | PascalCase | `TeacherForm.jsx`, `StatCard.jsx` |
| Hooks | camelCase + `use` prefix | `useAuth.js`, `useDebounce.js` |
| Redux slices | camelCase | `teacherSlice.js` |
| Redux actions | camelCase | `teacherActions.js` |
| Validation schemas | camelCase | `teacherSchema.js` |
| Utility functions | camelCase | `formatters.js` |
| Folder names | camelCase | `pages/coreSubjects/` |
| Route paths | kebab-case | `/core-subjects`, `/change-password` |
| CSS class names | Tailwind utilities or kebab-case custom classes |

### Import Order (every file)

```js
// 1. React core
import { useState, useEffect } from 'react';

// 2. Third-party libraries
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

// 3. Redux
import { useDispatch, useSelector } from 'react-redux';
import { fetchTeachers } from '../../redux/actions/teacherActions';

// 4. Shared components
import PrimaryButton from '../../components/buttons/PrimaryButton';
import FormField from '../../components/form/FormField';

// 5. Feature-local components
import TeacherRow from './components/TeacherRow';

// 6. Utils / hooks / validation
import { formatDate } from '../../utils/formatters';
import { teacherSchema } from '../../validation/teacherSchema';

// 7. Assets / styles (rare — most styling is Tailwind classes)
```

---

## 9. Layout Architecture

```
┌─────────────────────────────────────────────────────────┐
│ Browser Window                                          │
│ ┌──────────┬──────────────────────────────────────────┐ │
│ │          │  TopBar (sticky)                         │ │
│ │          │  [Page Title]    [Search] [Bell] [Avatar]│ │
│ │ Sidebar  ├──────────────────────────────────────────┤ │
│ │ (fixed)  │                                          │ │
│ │ 288px    │  Main Content Area (mesh-bg)             │ │
│ │          │  padding: 48px                           │ │
│ │ [Logo]   │                                          │ │
│ │ [Nav]    │  ┌────────────────────────────────────┐  │ │
│ │ [Nav]    │  │  glass-panel card / table / form   │  │ │
│ │ [Nav]    │  │                                    │  │ │
│ │          │  └────────────────────────────────────┘  │ │
│ │ [Logout] │                                          │ │
│ └──────────┴──────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────┘
```

- `MainLayout.jsx` renders Sidebar + TopBar + `<Outlet />` for nested routes.
- Sidebar nav items are role-driven from `src/utils/roleNavConfig.js`.
- Sidebar uses `custom-scrollbar` class for overflow.
- Active nav item gets `bg-primary text-white rounded-glass shadow-primary-glow-xs`.

---

## 10. Performance Rules

- `useMemo` — only for expensive derived data (filtering large lists, table computations). Not by default.
- `useCallback` — only when passing callbacks to memoized children.
- Lazy-load all route pages via `lazy()` + `Suspense`.
- Never fetch the same data twice in nested effects.
- Clean up effects on unmount.
- Redux Persist only for `auth` slice — nothing else should persist.

---

## 11. Recommended Packages

```json
{
  "dependencies": {
    "react": "^19.x",
    "react-dom": "^19.x",
    "react-router-dom": "^6.x",
    "@reduxjs/toolkit": "^2.x",
    "react-redux": "^9.x",
    "redux-persist": "^6.x",
    "axios": "^1.x",
    "react-hook-form": "^7.x",
    "@hookform/resolvers": "^3.x",
    "yup": "^1.x",
    "@tanstack/react-table": "^8.x",
    "react-hot-toast": "^2.x",
    "framer-motion": "^11.x",
    "lucide-react": "^0.400.x"
  },
  "devDependencies": {
    "vite": "^5.x",
    "tailwindcss": "^3.x",
    "postcss": "^8.x",
    "autoprefixer": "^10.x",
    "@vitejs/plugin-react": "^4.x"
  }
}
```

**Icons:** Use `lucide-react` for all icons. Consistent, lightweight, tree-shakeable. Do not mix icon libraries.

---

## 12. Environment Variables

```
VITE_API_URL=http://localhost:5000/api/v1
```

All env vars must be prefixed with `VITE_` for Vite to expose them. Access via `import.meta.env.VITE_API_URL`.

---

*All AI agents working on this codebase must read this file before generating any frontend code. Refer to `FRONTEND_SCAFFOLD.md` for the full page and integration specification.*
