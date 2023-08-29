/* eslint-disable no-console */
import { useState, useEffect } from 'react';
import './UserProfilePage.scss';
import { queryCustomer } from '../../api/api';
import { apiRoot } from '../../api/apiHelpers';
import { projectKey } from '../../api/apiConfig';

import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

import countries from '../../components/LoginForm/CountryData';

import Modal from 'react-modal';

import { ApiErrorResponse } from '../../types.ts';
import { toastForNoConnection, toastUpdate } from './toasts.ts';
import { TOAST_INTERNAL_SERVER_ERROR, TOAST_UPDATE_ERROR } from '../../constants.ts';
import { useContext } from 'react';
import { AuthContext } from '../../contexts/AuthContext.ts';

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
  },
};

Modal.setAppElement('#root');

const FormSchema = z.object({
  street: z.string().trim().nonempty(' is required to complete'),
  city: z
    .string()
    .trim()
    .min(1, { message: ' must contain at least one character' })
    .regex(/^(([a-zA-Z])(\s[a-zA-Z])?)+$/, ' must contain only letters of the Latin alphabet'),
  country: z.string().nonempty('Country is required to complete'),
  zip: z.string().trim().nonempty(' is required to complete'),
});

type FormRegistr = z.infer<typeof FormSchema>;

interface Country {
  id: string;
  descr: string;
  postCode: string;
}

interface Address {
  country?: string | undefined;
  city?: string | undefined;
  streetName?: string | undefined;
  postalCode?: string | undefined;
  id?: string | undefined;
}

interface Address2 {
  country: string;
  city: string;
  streetName: string;
  postalCode: string;
}

const tempAddress: Address = {
  country: 'US',
  city: 'New York',
  streetName: 'Baker',
  postalCode: '12345',
  id: '1',
};

export default function UserAddress() {
  const [addresses, setAddresses] = useState<Address[]>([tempAddress]);
  const [billingAddressIds, setBillingAddress] = useState<string[]>(['0']);
  const [shippingAddressIds, setShippingAddress] = useState<string[]>(['1']);
  const [defaultBillingAddress, setDefaultBilling] = useState<string>();
  const [defaultShippingAddress, setDefaultShipping] = useState<string>();
  const [version, setVersion] = useState<number>(1);

  const authContext = useContext(AuthContext);
  const userId = authContext.id;

  const countriesList = countries;
  const [activeCountry, setActiveCountry] = useState('US');

  const getZip = (): string => {
    const act: Country = countriesList.filter((item) => item.id === activeCountry)[0];
    return act.postCode;
  };

  const getName = (item: string): string => {
    const act: Country = countriesList.filter((c) => c.id === item)[0];
    return act.descr;
  };

  const [changeAddress, setChangeAddress] = useState<Address>(tempAddress);

  useEffect(() => {
    queryCustomer(userId)
      .then(({ body }) => {
        if (body?.version) {
          let data: number = body.version;
          setVersion(data++);
        }
        if (body?.addresses) {
          setAddresses(body.addresses);
        }
        if (body?.billingAddressIds) {
          setBillingAddress(body.billingAddressIds);
        }

        if (body?.shippingAddressIds) {
          setShippingAddress(body.shippingAddressIds);
        }
        if (body?.defaultBillingAddressId) {
          setDefaultBilling(body.defaultBillingAddressId);
        }

        if (body?.defaultShippingAddressId) {
          setDefaultShipping(body.defaultShippingAddressId);
        }
      })
      .catch(console.error);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [modalIsOpen, setIsOpen] = useState(false);

  function openModal() {
    setIsOpen(true);
  }

  function closeModal() {
    setIsOpen(false);
  }

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormRegistr>({
    mode: 'onChange',
    resolver: zodResolver(FormSchema),
  });

  const addressId = changeAddress.id ? changeAddress.id : '12345';
  const addressCountry = changeAddress.country ? changeAddress.country : 'US';
  const addressCity = changeAddress.city ? changeAddress.city : 'New York';
  const addressPostalCode = changeAddress.postalCode ? changeAddress.postalCode : '12345';
  const addressStreet = changeAddress.streetName ? changeAddress.streetName : 'Baker';

  useEffect(() => {
    setValue('country', addressCountry);
  }, [addressCountry, setValue]);

  useEffect(() => {
    setValue('city', addressCity);
  }, [addressCity, setValue]);

  useEffect(() => {
    setValue('zip', addressPostalCode);
  }, [addressPostalCode, setValue]);

  useEffect(() => {
    setValue('street', addressStreet);
  }, [addressStreet, setValue]);

  const onRenderError = (error: ApiErrorResponse) => {
    if (error.data.body.statusCode === 400) {
      return TOAST_UPDATE_ERROR;
    } else {
      return TOAST_INTERNAL_SERVER_ERROR;
    }
  };

  const onSubmit: SubmitHandler<FormRegistr> = async (data): Promise<void> => {
    const address: Address2 = {
      country: data.country,
      city: data.city,
      streetName: data.street,
      postalCode: data.zip,
    };

    try {
      if (toastForNoConnection()) {
        return;
      }
      await toastUpdate(onRenderError, () => updateAddress(userId, address, addressId, version));
      closeModal();
    } catch (error) {
      const apiError = error as ApiErrorResponse;
      console.error(apiError);
    }
  };

  const deleteAddress = async (item: Address): Promise<void> => {
    const id: string = item.id ? item.id : '123456';
    try {
      if (toastForNoConnection()) {
        return;
      }
      await toastUpdate(onRenderError, () => removeAddress(userId, id, version));
      closeModal();
    } catch (error) {
      const apiError = error as ApiErrorResponse;
      console.error(apiError);
    }
  };

  const defaultShipping = async (item: Address): Promise<void> => {
    const id: string = item.id ? item.id : '123456';
    try {
      if (toastForNoConnection()) {
        return;
      }
      await toastUpdate(onRenderError, () => addDefaultShipping(userId, id, version));
      closeModal();
    } catch (error) {
      const apiError = error as ApiErrorResponse;
      console.error(apiError);
    }
  };

  const defaultBilling = async (item: Address): Promise<void> => {
    const id: string = item.id ? item.id : '123456';
    try {
      if (toastForNoConnection()) {
        return;
      }
      await toastUpdate(onRenderError, () => addDefaultBilling(userId, id, version));
      closeModal();
    } catch (error) {
      const apiError = error as ApiErrorResponse;
      console.error(apiError);
    }
  };

  return (
    <>
      <div className='user__flex'>
        <div className='user__col'>
          <h2>Shipping addresses</h2>
          {addresses
            ?.filter((item) => item.id && shippingAddressIds?.includes(item?.id))
            .map((item, index) => {
              return (
                <div key={index} className='user__address'>
                  {defaultShippingAddress === item.id && (
                    <h4 className='user__default'>Shipping default address</h4>
                  )}
                  <p>
                    Country: <span>{item.country !== undefined && getName(item.country)}</span>
                  </p>
                  <p>
                    City: <span>{item.city}</span>
                  </p>
                  <p>
                    Street: <span>{item.streetName}</span>
                  </p>
                  <p>
                    Postal code: <span>{item.postalCode}</span>
                  </p>
                  <div className='user__flex'>
                    <button
                      className='user__btn'
                      onClick={() => {
                        setChangeAddress(item);
                        if (item.country) setActiveCountry(item.country);
                        openModal();
                      }}
                    >
                      Edit
                    </button>
                    <button className='user__btn' onClick={() => deleteAddress(item)}>
                      Delete
                    </button>
                    <button className='user__btn' onClick={() => defaultShipping(item)}>
                      Default
                    </button>
                  </div>
                </div>
              );
            })}
        </div>
        <div className='user__col'>
          <h2>Billing addresses</h2>
          {addresses
            ?.filter((item) => item.id && billingAddressIds?.includes(item?.id))
            .map((item, index) => {
              return (
                <div key={index} className='user__address'>
                  {defaultBillingAddress === item.id && (
                    <h4 className='user__default'>Billing default address</h4>
                  )}
                  <p>
                    Country: <span>{item.country !== undefined && getName(item.country)}</span>
                  </p>
                  <p>
                    City: <span>{item.city}</span>
                  </p>
                  <p>
                    Street: <span>{item.streetName}</span>
                  </p>
                  <p>
                    Postal code: <span>{item.postalCode}</span>
                  </p>
                  <div className='user__flex'>
                    <button
                      className='user__btn'
                      onClick={() => {
                        setChangeAddress(item);
                        if (item.country) setActiveCountry(item.country);
                        openModal();
                      }}
                    >
                      Edit
                    </button>
                    <button className='user__btn' onClick={() => deleteAddress(item)}>
                      Delete
                    </button>
                    <button className='user__btn' onClick={() => defaultBilling(item)}>
                      Default
                    </button>
                  </div>
                </div>
              );
            })}
        </div>
      </div>
      <div>
        <Modal
          isOpen={modalIsOpen}
          onRequestClose={closeModal}
          style={customStyles}
          contentLabel='Example Modal'
        >
          <button className='user__btn' onClick={closeModal}>
            x
          </button>
          <form className='user-form' autoComplete='off' onSubmit={handleSubmit(onSubmit)}>
            <fieldset>
              <div>
                <label htmlFor='street'>Street</label>
                {errors.street && <span className='user-form__error'>{errors.street.message}</span>}
                <input
                  id='street'
                  type='text'
                  {...register('street')}
                  className='user-form__input'
                />
              </div>

              <div>
                <label htmlFor='city'>City</label>
                {errors.city && <span className='user-form__error'>{errors.city.message}</span>}
                <input id='city' type='text' {...register('city')} className='user-form__input' />
              </div>
              <div>
                {errors.country && <p className='user-form__error'>{errors.country.message}</p>}
                <select
                  id='country'
                  {...register('country')}
                  onChange={(event) => setActiveCountry(event.target.value)}
                >
                  <option value='' disabled={true}>
                    Country
                  </option>
                  {countriesList.map((item: Country, index) => {
                    return (
                      <option key={index} value={item.id}>
                        {item.descr}
                      </option>
                    );
                  })}
                </select>
              </div>

              <div>
                <label htmlFor='zip'>
                  Postal code
                  {errors.zip && <span className='user-form__error'>{errors.zip.message}</span>}
                </label>
                <input
                  id='zip'
                  type='text'
                  {...register('zip')}
                  className='user-form__input'
                  pattern={getZip()}
                />
                <p className='user-form__error--zip'>
                  Enter the code according to the rules of the selected country
                </p>
              </div>
            </fieldset>
            <div className='user__flex'>
              <button className='user__btn' onClick={closeModal}>
                Cancel
              </button>
              <button className='user__btn' type='submit'>
                Save
              </button>
            </div>
          </form>
        </Modal>
      </div>
    </>
  );
}

const updateAddress = (
  customerID: string,
  address: Address2,
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

const removeAddress = (customerID: string, id: string, version: number) => {
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

const addDefaultShipping = (customerID: string, id: string, version: number) => {
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

const addDefaultBilling = (customerID: string, id: string, version: number) => {
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
