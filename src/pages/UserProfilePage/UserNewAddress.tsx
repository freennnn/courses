/* eslint-disable no-console */
import { useState, useEffect } from 'react';
import './UserProfilePage.scss';
import { queryCustomer } from '../../api/api';

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
import { customStyles } from '../../components/Modal/Modal.tsx';
import { UserNewAddressSchema } from '../../utils/schema.tsx';
import { Country, NewAddress } from './types.ts';
import { addAddress, addTypeAddress } from './apiUser.tsx';

type FormType = z.infer<typeof UserNewAddressSchema>;

interface Props {
  handleAddNewAddress: (arg: boolean) => void;
}

export default function UserNewAddress({ handleAddNewAddress }: Props) {
  const [version, setVersion] = useState(1);
  const { id: userId } = useContext(AuthContext);
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
  } = useForm<FormType>({
    mode: 'onChange',
    resolver: zodResolver(UserNewAddressSchema),
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

  const onSubmit: SubmitHandler<FormType> = async (data): Promise<void> => {
    const address: NewAddress = {
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
      await addTypeAddress(userId, key, version, data.typeadr);
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
