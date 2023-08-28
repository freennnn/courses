import { CustomerSignInResult, ClientResponse, Customer } from '@commercetools/platform-sdk';

export interface ApiErrorResponse {
  data: {
    body: {
      statusCode: number;
    };
  };
}

export type SignInOrSignUpFunction = () => Promise<ClientResponse<CustomerSignInResult>>;
export type UpdateFunction = () => Promise<ClientResponse<Customer>>;
