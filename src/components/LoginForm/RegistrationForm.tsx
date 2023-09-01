import React from 'react';
import { useContext, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

import countries from './CountryData';
import { RegistrationFormSchema } from '../../utils/schema.tsx';
import { signIn, signUp } from '../../api/api.ts';
import { TOAST_INTERNAL_SERVER_ERROR, TOAST_SIGN_UP_ERROR } from '../../constants.ts';
import { AuthContext, updateAuthContext } from '../../contexts/AuthContext.ts';
import { ApiErrorResponse } from '../../types.ts';
import countries from './CountryData';
import './LoginForm.scss';
import { toastForNoConnection, toastSignUp } from './toasts.ts';

type FormRegistr = z.infer<typeof RegistrationFormSchema>;

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
}

interface Customer {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  addresses: Address[];
  shippingAddresses: number[];
  billingAddresses: number[];
  defaultShippingAddress?: number;
  defaultBillingAddress?: number;
}

export default function Form() {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<FormRegistr>({
    mode: 'onChange',
    resolver: zodResolver(RegistrationFormSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      isChecked: false,
      dateOfBirth: new Date(),
      password: '',
      confirmPassword: '',
      country: '',
      city: '',
      zip: '',
      street: '',
      addressDefault: false,
      country2: '',
      city2: '',
      zip2: '',
      street2: '',
      addressDefault2: false,
    },
  });

  const authContext = useContext(AuthContext);

  type PasswordView = 'text' | 'password';

  const [passStyle, setPassStyle] = useState<PasswordView>('password');
  const [passStyleConfirm, setPassConfirmStyle] = useState<PasswordView>('password');
  const [signUpError, setSignUpError] = useState<null | ApiErrorResponse>(null);

  const navigate = useNavigate();

  const onRenderError = (error: ApiErrorResponse) => {
    if (error.data.body.statusCode === 400) {
      setSignUpError(error);
      return TOAST_SIGN_UP_ERROR;
    } else {
      return TOAST_INTERNAL_SERVER_ERROR;
    }
  };

  const onSubmit: SubmitHandler<FormRegistr> = async (data): Promise<void> => {
    const customer: Customer = {
      email: data.email,
      password: data.password,
      firstName: data.firstName,
      lastName: data.lastName,
      dateOfBirth: data.dateOfBirth.toISOString().slice(0, 10),
      addresses: [
        {
          country: data.country,
          city: data.city,
          streetName: data.street,
          postalCode: data.zip,
        },
        {
          country: data.country2,
          city: data.city2,
          streetName: data.street2,
          postalCode: data.zip2,
        },
      ],
      billingAddresses: [1],
      shippingAddresses: [0],
      defaultShippingAddress: data.addressDefault ? 0 : undefined,
      defaultBillingAddress: data.addressDefault2 ? 1 : undefined,
    };

    try {
      if (toastForNoConnection()) {
        return;
      }

      setSignUpError(null);

      await toastSignUp(onRenderError, () => signUp(customer));
      await signIn({ email: customer.email, password: customer.password });
      reset();
      updateAuthContext(authContext, { isSignedIn: true });
      navigate('/', { replace: true });
    } catch (error) {
      const apiError = error as ApiErrorResponse;
      /* eslint-disable-next-line no-console */
      console.error(apiError);
    }
  };

  const [activeCountry, setActiveCountry] = useState('US');
  const [activeCountry2, setActiveCountry2] = useState('US');

  const watchState = watch();

  watchState.country = activeCountry;
  const onChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    if (event.target.checked) {
      setValue('country2', watchState.country);
      setActiveCountry2(activeCountry);
      setValue('city2', watchState.city);
      setValue('street2', watchState.street);
      setValue('zip2', watchState.zip);
      setValue('isChecked', true);
    } else {
      setValue('country2', '');
      setValue('city2', '');
      setValue('street2', '');
      setValue('zip2', '');
      setValue('isChecked', false);
    }
  };

  const togglePass = (): void => {
    passStyle === 'password' ? setPassStyle('text') : setPassStyle('password');
  };

  const togglePassConfirm = (): void => {
    passStyleConfirm === 'password' ? setPassConfirmStyle('text') : setPassConfirmStyle('password');
  };

  const countriesList = countries;

  const getZip = (): string => {
    const act: Country = countriesList.filter((item) => item.id === activeCountry)[0];
    return act.postCode;
  };

  const getZip2 = (): string => {
    const act: Country = countriesList.filter((item) => item.id === activeCountry2)[0];
    return act.postCode;
  };

  return (
    <form className='reg-form' autoComplete='off' onSubmit={handleSubmit(onSubmit)}>
      <div>
        <label htmlFor='firstname'>First Name</label>
        {errors?.firstName?.message && (
          <span className='reg-form__error'>{errors.firstName.message}</span>
        )}
        <input
          id='firstname'
          {...register('firstName')}
          className='reg-form__input'
          placeholder='John'
        />
      </div>
      <div>
        <label htmlFor='lastname'>Last Name</label>
        {errors?.lastName?.message && (
          <span className='reg-form__error'>{errors.lastName.message}</span>
        )}
        <input
          id='lastname'
          {...register('lastName')}
          className='reg-form__input'
          placeholder='Doy'
        />
      </div>

      <div>
        <label htmlFor='email'>Email</label>
        {errors?.email?.message && <span className='reg-form__error'>{errors.email.message}</span>}
        <input
          id='email'
          {...register('email')}
          className={`reg-form__input ${signUpError ? 'server-error' : ''}`}
          placeholder='email@gmail.com'
        />
      </div>

      <div>
        <label htmlFor='dateOfBirth'>Date of birth</label>
        {errors?.dateOfBirth?.message && (
          <span className='reg-form__error'>{errors.dateOfBirth.message}</span>
        )}
        <input
          id='dateOfBirth'
          type='date'
          {...register('dateOfBirth')}
          className='reg-form__input'
        />
      </div>
      <div className='reg-form__flex'>
        <fieldset>
          <legend>Shipping Address</legend>

          <div>
            <label htmlFor='street'>Street</label>
            {errors.street && <span className='reg-form__error'>{errors.street.message}</span>}
            <input id='street' type='text' {...register('street')} className='reg-form__input' />
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

        <fieldset>
          <legend>Billing address</legend>

          <div>
            <label htmlFor='street2'>Street</label>
            {errors.street2 && <span className='reg-form__error'>{errors.street2.message}</span>}
            <input id='street2' type='text' {...register('street2')} className='reg-form__input' />
          </div>

          <div>
            <label htmlFor='city2'>City</label>
            {errors.city2 && <span className='reg-form__error'>{errors.city2.message}</span>}
            <input id='city2' type='text' {...register('city2')} className='reg-form__input' />
          </div>

          <div>
            {errors.country2 && <p className='reg-form__error'>{errors.country2.message}</p>}
            <select
              id='country2'
              {...register('country2')}
              onChange={(event) => setActiveCountry2(event.target.value)}
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
            <label htmlFor='zip2'>
              Postal code
              {errors.zip2 && <span className='reg-form__error'>{errors.zip2.message}</span>}
            </label>
            <input
              id='zip2'
              type='text'
              {...register('zip2')}
              className='reg-form__input'
              pattern={getZip2()}
            />
            <p className='reg-form__error--zip'>
              Enter the postal code according to the rules of the selected country
            </p>
          </div>
          <label htmlFor='defaultAd2'>
            <input id='defaultAd2' type='checkbox' {...register('addressDefault2')} />
            Use as a default address
          </label>
        </fieldset>
      </div>
      <div>
        <label htmlFor='isChecked'>
          <input id='isChecked' type='checkbox' {...register('isChecked')} onChange={onChange} />
          Use a single address for both billing and shipping
        </label>
      </div>

      <div className='reg-form__flex'>
        <div>
          <label htmlFor='password' className='reg-form__label-pass'>
            Password
            <input
              {...register('password')}
              type={passStyle}
              id='password'
              className='reg-form__input'
            />
            <div onClick={togglePass} className='reg-form__view'>
              👁️
            </div>
          </label>
          {errors.password && <span className='reg-form__error'>{errors.password.message}</span>}
        </div>
        <div>
          <label htmlFor='confirmPassword' className='reg-form__label-pass'>
            Confirm Password:
            <input
              type={passStyleConfirm}
              {...register('confirmPassword')}
              id='conformPassword'
              className='reg-form__input'
            />
            <div onClick={togglePassConfirm} className='reg-form__view'>
              👁️
            </div>
          </label>
          {errors.confirmPassword && (
            <span className='reg-form__error'>{errors.confirmPassword?.message}</span>
          )}
        </div>
      </div>

      <button type='submit' className='reg-form__btn'>
        Continue
      </button>
    </form>
  );
}
