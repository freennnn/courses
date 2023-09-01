import { apiRoot } from '../../api/apiHelpers';
import { projectKey } from '../../api/apiConfig';
import type { UserInfoData, UserPasswordData, NewAddress, ChangeAddressInput } from './types.ts';

export const queryCustomer = async (customerID: string) => {
  const response = await apiRoot
    .withProjectKey({ projectKey })
    .customers()
    .withId({ ID: customerID })
    .get()
    .execute();
  return response;
};

export const updateCustomerInfo = (userId: string, userInfo: UserInfoData, version: number) => {
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

export const customerChangePassword = (
  customerID: string,
  userPassword: UserPasswordData,
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

export const updateAddress = (
  customerID: string,
  address: ChangeAddressInput,
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
            address,
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

export const addAddress = (customerID: string, address: NewAddress, version: number) => {
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
            action: 'addAddress',
            address,
          },
        ],
      },
    })
    .execute();
};

export const addTypeAddress = (
  customerID: string,
  id: string,
  version: number,
  addressType: string,
) => {
  return apiRoot
    .withProjectKey({ projectKey })
    .customers()
    .withId({ ID: customerID })
    .post({
      // The CustomerUpdate is the object within the body
      body: {
        // The version of a new Customer is 1. This value is incremented every time an update action is applied to the Customer. If the specified version does not match the current version, the request returns an error.
        version: version + 1,
        actions: [
          {
            action: addressType === 'billing' ? 'addBillingAddressId' : 'addShippingAddressId',
            addressKey: id,
          },
        ],
      },
    })
    .execute();
};
