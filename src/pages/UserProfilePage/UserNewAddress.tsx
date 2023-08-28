/* eslint-disable no-console */
import { useState } from 'react';
import './UserProfilePage.scss';
import { queryCustomer, addAddress, addShipAddress, addBillAddress } from '../../api/api';

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

export default function UserNewAddress() {
  const [version, setVersion] = useState<number>(1);

  const authContext = useContext(AuthContext);
  const userId = authContext.id;

  queryCustomer(userId)
    .then(({ body }) => {
      if (body?.version) {
        let data: number = body.version;
        setVersion(data++);
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
      const key = data.country + data.city + data.street + data.zip + version;
      if (data.typeadr === 'shipping') await addShipAddress(userId, key, version);
      if (data.typeadr === 'billing') await addBillAddress(userId, key, version);
      closeModal();
    } catch (error) {
      const apiError = error as ApiErrorResponse;
      console.error(apiError);
    }
  };

  return (
    <>
      <button onClick={openModal}>add address</button>
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
              <label htmlFor='shipping'>
                <input id='shipping' type='radio' value='shipping' {...register('typeadr')} />
                Use as a shipping address
              </label>
              <label htmlFor='billing'>
                <input id='billing' type='radio' value='billing' {...register('typeadr')} />
                Use as a billing address
              </label>
              {errors.typeadr && <span className='reg-form__error'>{errors.typeadr.message}</span>}
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
