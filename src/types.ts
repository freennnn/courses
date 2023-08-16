import { CustomerSignInResult, ClientResponse } from '@commercetools/platform-sdk';

export interface ApiErrorResponse {
  data: {
    body: {
      statusCode: number;
    };
  };
}

export type SignInOrSignUpFunction = () => Promise<ClientResponse<CustomerSignInResult>>;
