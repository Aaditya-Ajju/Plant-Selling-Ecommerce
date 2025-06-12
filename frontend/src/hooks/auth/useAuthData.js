import React, { useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { resendOtpTwoFactorAuthAsync, userAccountVerificationAsync, userLoginAsync, userLogoutAsync, userSignupAsync, validatePasswordResetAsync, validatePasswordResetTokenAsync, validateTwoFactorAuthAsync, validateTwoFactorAuthTokenAsync, validateVerificationTokenAsync } from '../../features/auth/authSlice';
import { userProfileAsync } from '../../features/user/userSlice';

const useAuthData = () => {
  const auth = useSelector((state) => state.auth);

  const dispatch = useDispatch()

  const userLogin = useCallback(async (user) => {
    const result = await dispatch(userLoginAsync(user));
    if (userLoginAsync.fulfilled.match(result)) {
      // Dispatch userProfileAsync only if login is successful and not requiring 2FA or verification
      if (!result.payload.code) { // Check if there's no special code (like 2FA or verification)
        dispatch(userProfileAsync());
      }
    }
  }, [dispatch]);

  const userLogout = useCallback(() => {
    dispatch(userLogoutAsync());
  }, [dispatch]);

  const userSignup = useCallback((user) => {
    dispatch(userSignupAsync(user));
  }, [dispatch]);

  const userAccountVerification = useCallback((user) => {
    dispatch(userAccountVerificationAsync(user));
  }, [dispatch]);

  const validateVerificationToken = useCallback((token) => {
    dispatch(validateVerificationTokenAsync(token));
  }  , [dispatch]);

  const validatePasswordResetToken = useCallback((token) => {
    dispatch(validatePasswordResetTokenAsync(token));
  }  , [dispatch]);

  const validatePasswordReset = useCallback((token) => {
    dispatch(validatePasswordResetAsync(token));
  }  , [dispatch]);

  const validateTwoFactorAuthToken = useCallback((token) => {
    dispatch(validateTwoFactorAuthTokenAsync(token));
  }  , [dispatch]);

  const validateTwoFactorAuth = useCallback((token) => {
    dispatch(validateTwoFactorAuthAsync(token));
  }  , [dispatch]);

  const resendOtpTwoFactorAuth = useCallback((user) => {
    dispatch(resendOtpTwoFactorAuthAsync(user));
  }  , [dispatch]);


  return {auth, userLogin, userLogout, userSignup, userAccountVerification, validateVerificationToken, validatePasswordResetToken, validatePasswordReset, validateTwoFactorAuthToken, validateTwoFactorAuth, resendOtpTwoFactorAuth}
}

export default useAuthData