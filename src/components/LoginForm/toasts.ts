import { toast } from 'react-toastify';

import { ApiErrorResponse, SignInOrSignUpFunction } from '../../types.ts';
import {
  TOAST_NO_CONNECTION,
  TOAST_SIGN_IN_PENDING,
  TOAST_SIGN_UP_PENDING,
} from '../../constants.ts';

export const toastForNoConnection = () => {
  if (!navigator.onLine) {
    toast.error(TOAST_NO_CONNECTION);
    return true;
  }
};

export const toastSignIn = async (
  onRenderError: (error: ApiErrorResponse) => string,
  signIn: SignInOrSignUpFunction,
) => {
  await toast.promise(signIn(), {
    pending: TOAST_SIGN_IN_PENDING,
    error: {
      render(error) {
        const apiError = error as ApiErrorResponse;
        return onRenderError(apiError);
      },
    },
  });
};

export const toastSignUp = async (
  onRenderError: (error: ApiErrorResponse) => string,
  signUp: SignInOrSignUpFunction,
) => {
  await toast.promise(signUp(), {
    pending: TOAST_SIGN_UP_PENDING,
    error: {
      render(error) {
        const apiError = error as ApiErrorResponse;
        return onRenderError(apiError);
      },
    },
  });
};
