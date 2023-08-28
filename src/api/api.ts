import { CustomerSignin, CustomerDraft } from '@commercetools/platform-sdk';

import { apiRoot, getAuthApiRoot } from './apiHelpers';
import { projectKey } from './apiConfig';

export const signIn = async (loginRequest: CustomerSignin) => {
  const authApiRoot = getAuthApiRoot(loginRequest);

  const response = await authApiRoot
    .withProjectKey({ projectKey })
    .login()
    .post({ body: loginRequest })
    .execute();

  return response;
};

export const signUp = async (customer: CustomerDraft) => {
  const response = await apiRoot
    .withProjectKey({ projectKey })
    .customers()
    .post({ body: customer })
    .execute();

  return response;
};

export const queryCustomer = async (customerID: string) => {
  const response = await apiRoot
    .withProjectKey({ projectKey })
    .customers()
    .withId({ ID: customerID })
    .get()
    .execute();

  return response;
};

interface userInfo {
  email: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
}

export const updateCustomerInfo = (userId: string, userInfo: userInfo, version: number) => {
  return apiRoot
    .withProjectKey({ projectKey })
    .customers()
    .withId({ ID: userId })
    .post({
      // The CustomerUpdate is the object within the body
      body: {
        // The version of a new Customer is 1. This value is incremented every time an update action is applied to the Customer. If the specified version does not match the current version, the request returns an error.
        version: version,
        actions: [
          {
            action: 'setFirstName',
            firstName: userInfo.firstName,
          },
          {
            action: 'setLastName',
            lastName: userInfo.lastName,
          },
          {
            action: 'changeEmail',
            email: userInfo.email,
          },
          {
            action: 'setDateOfBirth',
            dateOfBirth: userInfo.dateOfBirth,
          },
        ],
      },
    })
    .execute();
};

interface userPassword {
  password: string;
  oldpassword: string;
}

export const customerChangePassword = (
  customerID: string,
  userPassword: userPassword,
  version: number,
) => {
  return apiRoot
    .withProjectKey({ projectKey })
    .customers()
    .password()
    .post({
      // The CustomerUpdate is the object within the body
      body: {
        // The version of a new Customer is 1. This value is incremented every time an update action is applied to the Customer. If the specified version does not match the current version, the request returns an error.
        id: customerID,
        version: version,
        currentPassword: userPassword.oldpassword,
        newPassword: userPassword.password,
      },
    })
    .execute();
};

interface Address {
  country: string;
  city: string;
  streetName: string;
  postalCode: string;
}

export const updateAddress = (
  customerID: string,
  address: Address,
  addressId: string,
  version: number,
) => {
  return apiRoot
    .withProjectKey({ projectKey })
    .customers()
    .withId({ ID: customerID })
    .post({
      // The CustomerUpdate is the object within the body
      body: {
        // The version of a new Customer is 1. This value is incremented every time an update action is applied to the Customer. If the specified version does not match the current version, the request returns an error.
        version: version,
        actions: [
          {
            action: 'changeAddress',
            addressId: addressId,
            address: {
              streetName: address.streetName,
              city: address.city,
              country: address.country,
              postalCode: address.postalCode,
            },
          },
        ],
      },
    })
    .execute();
};

export const removeAddress = (customerID: string, id: string, version: number) => {
  return apiRoot
    .withProjectKey({ projectKey })
    .customers()
    .withId({ ID: customerID })
    .post({
      // The CustomerUpdate is the object within the body
      body: {
        // The version of a new Customer is 1. This value is incremented every time an update action is applied to the Customer. If the specified version does not match the current version, the request returns an error.
        version: version,
        actions: [
          {
            action: 'removeAddress',
            addressId: id,
          },
        ],
      },
    })
    .execute();
};

export const addDefaultShipping = (customerID: string, id: string, version: number) => {
  return apiRoot
    .withProjectKey({ projectKey })
    .customers()
    .withId({ ID: customerID })
    .post({
      // The CustomerUpdate is the object within the body
      body: {
        // The version of a new Customer is 1. This value is incremented every time an update action is applied to the Customer. If the specified version does not match the current version, the request returns an error.
        version: version,
        actions: [
          {
            action: 'setDefaultShippingAddress',
            addressId: id,
          },
        ],
      },
    })
    .execute();
};

export const addDefaultBilling = (customerID: string, id: string, version: number) => {
  return apiRoot
    .withProjectKey({ projectKey })
    .customers()
    .withId({ ID: customerID })
    .post({
      // The CustomerUpdate is the object within the body
      body: {
        // The version of a new Customer is 1. This value is incremented every time an update action is applied to the Customer. If the specified version does not match the current version, the request returns an error.
        version: version,
        actions: [
          {
            action: 'setDefaultBillingAddress',
            addressId: id,
          },
        ],
      },
    })
    .execute();
};
