import { ClientResponse, Customer } from '@commercetools/platform-sdk';

export interface UserInfoData {
  email: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
}

export interface Country {
  id: string;
  descr: string;
  postCode: string;
}

export interface NewAddress {
  country: string;
  city: string;
  streetName: string;
  postalCode: string;
  key: string;
}

export interface AddressResponse {
  country?: string | undefined;
  city?: string | undefined;
  streetName?: string | undefined;
  postalCode?: string | undefined;
  id?: string | undefined;
  key?: string | undefined;
}

export interface ChangeAddressInput {
  country: string;
  city: string;
  streetName: string;
  postalCode: string;
}

export interface UserPasswordData {
  password: string;
  oldpassword: string;
}

export type PasswordView = 'text' | 'password';

export type UpdateFunction = () => Promise<ClientResponse<Customer>>;
