import useAuth from './useAuth';

const usePermission = (allowed = []) => {
  const { user } = useAuth();
  return allowed.includes(user?.role);
};

export default usePermission;
