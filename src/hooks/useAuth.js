import { useSelector } from 'react-redux';

const useAuth = () => {
  const auth = useSelector((state) => state.auth);

  return {
    ...auth,
    isAuthenticated: Boolean(auth.token),
    isAdmin: auth.user?.role === 'admin',
    isTeacher: auth.user?.role === 'teacher',
    isStudent: auth.user?.role === 'student',
  };
};

export default useAuth;
