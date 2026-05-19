import { useEffect, useMemo } from 'react';
import useAuthData from './useAuthData';

const useUserLogout = () => {
  const { auth, userLogout } = useAuthData();
  const isLoading = useMemo(() => auth.isLoading, [auth.isLoading]);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      userLogout(); // Trigger logout side-effect (e.g., clear state, redirect, notify)
    }
  }, [userLogout]);

  return { isLoading };
}

export default useUserLogout