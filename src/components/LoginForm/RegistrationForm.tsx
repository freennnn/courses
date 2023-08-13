/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable no-console */
import * as React from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import './LoginForm.scss';
import countries from './CountryData';
import { signUp } from '../../api/api.ts';

const FormSchema = z
  .object({
    firstName: z
      .string()
      .nonempty(' is required')
      .min(1, { message: ' must be 1 characters or more' })
      .regex(/^[a-zA-Z]+$/, ' must contain only letters latin alphabet'),
    lastName: z
      .string()
      .nonempty(' is required')
      .min(1, { message: ' must be 1 characters or more' })
      .regex(/^[a-zA-Z]+$/, ' must contain only letters latin alphabet'),
    email: z.string().nonempty(' is required').email({
      message: ' is invalid. Please enter a valid email address',
    }),
    isChecked: z.boolean(),
    num: z.number(),
    street: z.string().nonempty(' is required'),
    street2: z.string().nonempty(' is required'),
    city: z.string().nonempty(' is required'),
    addressDefault: z.boolean(),
    city2: z.string().nonempty(' is required'),
    state: z.string().nonempty('Country is required'),
    state2: z.string().nonempty('Country is required'),
    addressDefault2: z.boolean(),
    zip: z.string().nonempty(' is required'),
    zip2: z.string().nonempty(' is required'),
    dateOfBirth: z.coerce
      .date()
      .min(new Date(1920, 0, 1), {
        message: ' cannot go past January 1 1923',
      })
      .max(new Date(), { message: ' is requierd' })
      .refine(
        (date: Date) => {
          const ageTime = new Date(Date.now() - date.getTime());
          const age = Math.abs(ageTime.getUTCFullYear() - 1970);
          return age >= 18;
        },
        { message: 'You must be 18 years or older' },
      ),
    password: z
      .string()
      .min(8, ' must have at least 8 characters')
      .regex(/[0-9]/, ' must have at least 1 digit character')
      .regex(/[a-z]/, ' must have at least 1 lowercase letter')
      .regex(/[A-Z]/, ' must have at least 1 uppercase letter'),

    confirmPassword: z.string().min(8, { message: ' must be at least 8 characters' }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Passwords do not match',
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
}

interface Customer {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  addresses: Address[];
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
    resolver: zodResolver(FormSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      isChecked: false,
      dateOfBirth: new Date(),
      password: '',
      confirmPassword: '',
      state: '',
      city: '',
      zip: '',
      street: '',
      addressDefault: false,
      state2: '',
      city2: '',
      zip2: '',
      street2: '',
      addressDefault2: false,
    },
  });

  const [passStyle, setPassStyle] = React.useState('password');

  const [passStyleConfirm, setPassConfirmStyle] = React.useState('password');

  const [activeCountry, setActiveCountry] = React.useState('US');

  const countriesList = countries;

  const getZip = (): string => {
    const act: Country = countriesList.filter((item) => item.id === activeCountry)[0];
    return act.postCode;
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
          country: data.state,
          city: data.city,
          streetName: data.street,
          postalCode: data.zip,
        },
        {
          country: data.state2,
          city: data.city2,
          streetName: data.street2,
          postalCode: data.zip2,
        },
      ],
    };
    console.log(customer);
    await signUp(customer);
    reset();
  };

  const watchState = watch();

  const onChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    if (event.target.checked) {
      setValue('state2', watchState.state);
      setValue('city2', watchState.city);
      setValue('street2', watchState.street);
      setValue('zip2', watchState.zip);
    } else {
      setValue('state2', '');
      setValue('city2', '');
      setValue('street2', '');
      setValue('zip2', '');
    }
  };

  const togglePass = (): void => {
    passStyle === 'password' ? setPassStyle('text') : setPassStyle('password');
  };

  const togglePassConfirm = (): void => {
    passStyleConfirm === 'password' ? setPassConfirmStyle('text') : setPassConfirmStyle('password');
  };

  return (
    <form className='reg-form' onSubmit={handleSubmit(onSubmit)}>
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
          className='reg-form__input'
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
            {errors.state && <p className='reg-form__error'>{errors.state.message}</p>}
            <select
              id='state'
              {...register('state')}
              onChange={(event) => setActiveCountry(event.target.value)}
            >
              <option value=''>Country</option>
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
              Zip:
              {errors.zip && <span className='reg-form__error'>{errors.zip.message}</span>}
            </label>
            <input
              id='zip'
              type='text'
              {...register('zip')}
              className='reg-form__input'
              pattern={getZip()}
            />
            <p className='reg-form__error--zip'>Zip change</p>
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
            {errors.state2 && <p className='reg-form__error'>{errors.state2.message}</p>}
            <select id='state2' {...register('state2')}>
              <option value=''>Country</option>
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
            <label htmlFor='zip2'>Zip</label>
            {errors.zip2 && <span className='reg-form__error'>{errors.zip2.message}</span>}
            <input
              id='zip2'
              type='text'
              {...register('zip2')}
              className='reg-form__input'
              pattern={getZip()}
            />
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
            {errors.password && <span className='reg-form__error'>{errors.password.message}</span>}
            <input
              {...register('password')}
              type={passStyle}
              id='password'
              className='reg-form__input'
              placeholder='********'
            />
            <div onClick={togglePass} className='reg-form__view'>
              👁️
            </div>
          </label>
        </div>
        <div>
          <label htmlFor='confirmPassword' className='reg-form__label-pass'>
            Confirm Password:{' '}
            {errors.confirmPassword && (
              <span className='reg-form__error'>{errors.confirmPassword?.message}</span>
            )}
            <input
              type={passStyleConfirm}
              placeholder='Confirm password'
              {...register('confirmPassword')}
              id='conformPassword'
              className='reg-form__input'
            />
            <div onClick={togglePassConfirm} className='reg-form__view'>
              👁️
            </div>
          </label>
        </div>
      </div>

      <button type='submit' className='reg-form__btn'>
        Continue
      </button>
    </form>
  );
}
