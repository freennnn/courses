/* eslint-disable no-console */
import { useState, useEffect } from 'react';
import './UserProfilePage.scss';
import {
  queryCustomer,
  updateAddress,
  removeAddress,
  addDefaultShipping,
  addDefaultBilling,
} from '../../api/api';

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
  addressDefault: z.boolean(),
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
      <div>
        <div>
          Shipping addresses
          {addresses
            ?.filter((item) => item.id && shippingAddressIds?.includes(item?.id))
            .map((item, index) => {
              return (
                <div key={index}>
                  <p>{item.country !== undefined && getName(item.country)}</p>
                  <p>{item.city}</p>
                  <p>{item.streetName}</p>
                  <p>{item.postalCode}</p>
                  {defaultShippingAddress === item.id && <p>Shipping default address</p>}
                  <button
                    onClick={() => {
                      setChangeAddress(item);
                      openModal();
                    }}
                  >
                    Edit
                  </button>
                  <button onClick={() => deleteAddress(item)}>Delete</button>
                  <button onClick={() => defaultShipping(item)}>Default</button>
                </div>
              );
            })}
        </div>
        <div>
          Billing addresses
          {addresses
            ?.filter((item) => item.id && billingAddressIds?.includes(item?.id))
            .map((item, index) => {
              return (
                <div key={index}>
                  <p>{item.country !== undefined && getName(item.country)}</p>
                  <p>{item.city}</p>
                  <p>{item.streetName}</p>
                  <p>{item.postalCode}</p>
                  {defaultBillingAddress === item.id && <p>Billing default address</p>}
                  <button
                    onClick={() => {
                      setChangeAddress(item);
                      openModal();
                    }}
                  >
                    Edit
                  </button>
                  <button onClick={() => deleteAddress(item)}>Delete</button>
                  <button onClick={() => defaultBilling(item)}>Default</button>
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
          <button onClick={closeModal}>close</button>
          <form className='reg-form' autoComplete='off' onSubmit={handleSubmit(onSubmit)}>
            <fieldset>
              <div>
                <label htmlFor='street'>Street</label>
                {errors.street && <span className='reg-form__error'>{errors.street.message}</span>}
                <input
                  id='street'
                  type='text'
                  {...register('street')}
                  className='reg-form__input'
                />
              </div>

              <div>
                <label htmlFor='city'>City</label>
                {errors.city && <span className='reg-form__error'>{errors.city.message}</span>}
                <input id='city' type='text' {...register('city')} className='reg-form__input' />
              </div>
              <div>
                {errors.country && <p className='reg-form__error'>{errors.country.message}</p>}
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
                  {errors.zip && <span className='reg-form__error'>{errors.zip.message}</span>}
                </label>
                <input
                  id='zip'
                  type='text'
                  {...register('zip')}
                  className='reg-form__input'
                  pattern={getZip()}
                />
                <p className='reg-form__error--zip'>
                  Enter the code according to the rules of the selected country
                </p>
              </div>
              <label htmlFor='defaultAd'>
                <input id='defaultAd' type='checkbox' {...register('addressDefault')} />
                Use as a default address
              </label>
            </fieldset>
            <button type='submit' className='reg-form__btn'>
              Continue
            </button>
          </form>
        </Modal>
      </div>
    </>
  );
}
