export const HTTP_MIDDLEWARE_HOST = 'https://api.us-central1.gcp.commercetools.com';
export const AUTH_MIDDLEWARE_HOST = 'https://auth.us-central1.gcp.commercetools.com';

export const projectKey: string =
  typeof import.meta.env.VITE_CTP_PROJECT_KEY === 'string'
    ? import.meta.env.VITE_CTP_PROJECT_KEY
    : '';

export const clientId: string =
  typeof import.meta.env.VITE_CTP_CLIENT_ID === 'string' ? import.meta.env.VITE_CTP_CLIENT_ID : '';

export const clientSecret: string =
  typeof import.meta.env.VITE_CTP_CLIENT_SECRET === 'string'
    ? import.meta.env.VITE_CTP_CLIENT_SECRET
    : '';
