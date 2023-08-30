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

Modal.setAppElement('#root');

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

const FormSchema = z.object({
  street: z.string().trim().nonempty(' is required to complete'),
  city: z
    .string()
    .trim()
    .min(1, { message: ' must contain at least one character' })
    .regex(/^(([a-zA-Z])(\s[a-zA-Z])?)+$/, ' must contain only letters of the Latin alphabet'),
  country: z.string().nonempty('Country is required to complete'),
  zip: z.string().trim().nonempty(' is required to complete'),
  typeadr: z.string({
    invalid_type_error: 'Choose, please, one of types',
  }),
});

type FormRegistr = z.infer<typeof FormSchema>;

interface Country {
  id: string;
  descr: string;
  postCode: string;
}

interface Address {
  country: string;
  city: string;
  streetName: string;
  postalCode: string;
  key: string;
}

interface Props {
  handleAddNewAddress: (arg: boolean) => void;
}

export default function UserNewAddress({ handleAddNewAddress }: Props) {
  const [version, setVersion] = useState<number>(1);

  const authContext = useContext(AuthContext);
  const userId = authContext.id;

  const [modalIsOpen, setIsOpen] = useState(false);

  function openModal() {
    setIsOpen(true);
  }

  function closeModal() {
    setIsOpen(false);
  }

  useEffect(() => {
    queryCustomer(userId)
      .then(({ body }) => {
        if (body?.version) {
          let data: number = body.version;
          setVersion(data++);
        }
      })
      .catch(console.error);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [modalIsOpen]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormRegistr>({
    mode: 'onChange',
    resolver: zodResolver(FormSchema),
  });

  const countriesList = countries;
  const [activeCountry, setActiveCountry] = useState('US');

  const getZip = (): string => {
    const act: Country = countriesList.filter((item) => item.id === activeCountry)[0];
    return act.postCode;
  };

  const onRenderError = (error: ApiErrorResponse) => {
    if (error.data.body.statusCode === 400) {
      return TOAST_UPDATE_ERROR;
    } else {
      return TOAST_INTERNAL_SERVER_ERROR;
    }
  };

  const onSubmit: SubmitHandler<FormRegistr> = async (data): Promise<void> => {
    const address: Address = {
      country: data.country,
      city: data.city,
      streetName: data.street,
      postalCode: data.zip,
      key: data.country + data.city + data.street + data.zip + version,
    };

    try {
      if (toastForNoConnection()) {
        return;
      }
      await toastUpdate(onRenderError, () => addAddress(userId, address, version));
      handleAddNewAddress(true);
      const key = data.country + data.city + data.street + data.zip + version;
      if (data.typeadr === 'shipping') await addShipAddress(userId, key, version);
      if (data.typeadr === 'billing') await addBillAddress(userId, key, version);
      handleAddNewAddress(false);
      closeModal();
    } catch (error) {
      const apiError = error as ApiErrorResponse;
      console.error(apiError);
    }
  };

  return (
    <>
      <button className='user__btn' onClick={openModal}>
        add address
      </button>
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
              <label htmlFor='shipping'>
                <input id='shipping' type='radio' value='shipping' {...register('typeadr')} />
                Use as a shipping address
              </label>
              <label htmlFor='billing'>
                <input id='billing' type='radio' value='billing' {...register('typeadr')} />
                Use as a billing address
              </label>
              {errors.typeadr && <span className='user-form__error'>{errors.typeadr.message}</span>}
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

const addAddress = (customerID: string, address: Address, version: number) => {
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
            address: {
              key: address.key,
              streetName: address.streetName,
              postalCode: address.postalCode,
              city: address.city,
              country: address.country,
            },
          },
        ],
      },
    })
    .execute();
};

const addShipAddress = (customerID: string, id: string, version: number) => {
  return apiRoot
    .withProjectKey({ projectKey })
    .customers()
    .withId({ ID: customerID })
    .post({
      // The CustomerUpdate is the object within the body
      body: {
        // The version of a new Customer is 1. This value is incremented every time an update action is applied to the Customer. If the specified version does not match the current version, the request returns an error.
        version: (version = version + 1),
        actions: [
          {
            action: 'addShippingAddressId',
            addressKey: id,
          },
        ],
      },
    })
    .execute();
};

const addBillAddress = (customerID: string, id: string, version: number) => {
  return apiRoot
    .withProjectKey({ projectKey })
    .customers()
    .withId({ ID: customerID })
    .post({
      // The CustomerUpdate is the object within the body
      body: {
        // The version of a new Customer is 1. This value is incremented every time an update action is applied to the Customer. If the specified version does not match the current version, the request returns an error.
        version: (version = version + 1),
        actions: [
          {
            action: 'addBillingAddressId',
            addressKey: id,
          },
        ],
      },
    })
    .execute();
};
