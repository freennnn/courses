import {
  CustomerSignInResult,
  ClientResponse,
  Attribute,
  Image,
  LocalizedString,
  CategoryReference,
  Customer,
} from '@commercetools/platform-sdk';

export interface ApiErrorResponse {
  data: {
    body: {
      statusCode: number;
    };
  };
}

export type SignInOrSignUpFunction = () => Promise<ClientResponse<CustomerSignInResult>>;

export interface ProductItem {
  id: string;
  name: LocalizedString;
  categories: CategoryReference[];
  description: LocalizedString | undefined;
  images: Image[] | undefined;
  attributes: Attribute[] | undefined;
  discount: DiscountsType | undefined | number;
  price: number | undefined;
}

export interface DiscountsType {
  sortOrder: string;
  discount: number;
}

export type UpdateFunction = () => Promise<ClientResponse<Customer>>;
