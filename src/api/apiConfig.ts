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

export const scopes = [
  `manage_my_orders:${projectKey} view_categories:${projectKey} view_published_products:${projectKey} view_products:${projectKey} manage_my_profile:${projectKey} view_orders:${projectKey} manage_customers:${projectKey} view_payments:${projectKey} manage_my_payments:${projectKey} create_anonymous_token:${projectKey} manage_my_business_units:${projectKey} manage_my_quotes:${projectKey} manage_my_shopping_lists:${projectKey} view_cart_discounts:${projectKey} manage_my_quote_requests:${projectKey}`,
];

export const manageCustomersScope = [`manage_customers:${projectKey}`];
