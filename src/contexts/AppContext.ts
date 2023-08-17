import { createContext } from 'react';

interface AppContextValues {
  isSignedIn: boolean;
}

interface SetAppContextFunction {
  setAppContext: (data: AppContextValues) => void;
}

type AppContext = AppContextValues & SetAppContextFunction;

// Add new app context variables here
export const defaultContextValues: AppContextValues = {
  isSignedIn: false,
};

export const defaultContext: AppContext = {
  ...defaultContextValues,
  /* eslint-disable-next-line no-console */
  setAppContext: (data) => console.log(data),
};

export const AppContext = createContext(defaultContext);

/**
 * Updates global application context
 * @param {AppContext} appContext - global application context
 * @param {Partial<AppContextValues>} values - context fields which we want to update
 */
export const updateAppContext = (appContext: AppContext, values: Partial<AppContextValues>) => {
  appContext.setAppContext({
    ...appContext,
    ...values,
  });
};
