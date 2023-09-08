import { createContext } from 'react';

interface AuthContextValues {
  isSignedIn: boolean;
  id: string;
}

interface SetAuthContextFunction {
  setAuthContext: (data: AuthContextValues) => void;
}

type AuthContext = AuthContextValues & SetAuthContextFunction;

// Add new app context variables here
export const defaultAuthContextValues: AuthContextValues = {
  isSignedIn: false,
  id: '',
};

export const defaultContext: AuthContext = {
  ...defaultAuthContextValues,
  /* eslint-disable-next-line no-console */
  setAuthContext: (data) => console.log(data),
};

export const AuthContext = createContext(defaultContext);

/**
 * Updates global application context
 * @param {AuthContext} authContext - global application context
 * @param {Partial<AuthContextValues>} values - context fields which we want to update
 */
export const updateAuthContext = (authContext: AuthContext, values: Partial<AuthContextValues>) => {
  authContext.setAuthContext({
    ...authContext,
    ...values,
  });
};
