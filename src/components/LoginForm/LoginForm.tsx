import { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

import { signIn } from '../../api/api.ts';
import { ApiErrorResponse } from '../../types.ts';
import { toastForNoConnection, toastSignIn } from './toasts.ts';

import './LoginForm.scss';

const FormSchema = z.object({
  email: z.string().nonempty(' is required').email({
    message: ' is invalid. Please enter a valid email address',
  }),
  password: z
    .string()
    .nonempty(' is required')
    .min(8, 'Password must have at least 8 characters')
    .regex(/[0-9]/, 'Your password must have at least 1 digit character')
    .regex(/[a-z]/, 'Your password must have at least 1 lowercase character')
    .regex(/[A-Z]/, 'Your password must have at least 1 uppercasecharacter'),
});

export type FormInput = z.infer<typeof FormSchema>;

export default function Form() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormInput>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const [passStyle, setPassStyle] = useState('password');
  const [signInError, setSignInError] = useState<null | ApiErrorResponse>(null);

  const onRenderError = (error: ApiErrorResponse) => {
    if (error.data.body.statusCode === 400) {
      setSignInError(error);
      return 'Incorrect login or password. Please try again!';
    } else {
      return 'Internal server error. Please try again!';
    }
  };

  const onSubmit: SubmitHandler<FormInput> = async (data): Promise<void> => {
    try {
      if (toastForNoConnection()) {
        return;
      }

      setSignInError(null);
      await toastSignIn(onRenderError, () => signIn(data));
      reset();
    } catch (error) {
      const apiError = error as ApiErrorResponse;
      /* eslint-disable-next-line no-console */
      console.error(apiError);
    }
  };

  const togglePass = (): void => {
    passStyle === 'password' ? setPassStyle('text') : setPassStyle('password');
  };

  return (
    <form className='reg-form' onSubmit={handleSubmit(onSubmit)}>
      <div>
        <label htmlFor='email'>Email</label>
        {errors?.email?.message && <span className='reg-form__error'>{errors.email.message}</span>}
        <input
          id='email'
          {...register('email')}
          className={`reg-form__input ${signInError ? 'server-error' : ''}`}
          placeholder='email@gmail.com'
        />
      </div>

      <div>
        <label htmlFor='password' className='reg-form__label-pass'>
          Password{' '}
          {errors.password && <span className='reg-form__error'>{errors.password.message}</span>}
          <input
            {...register('password')}
            type={passStyle}
            id='password'
            className={`reg-form__input ${signInError ? 'server-error' : ''}`}
          />
          <div onClick={togglePass} className='reg-form__view'>
            👁️
          </div>
        </label>
      </div>

      <button type='submit' className='reg-form__btn'>
        Continue
      </button>
    </form>
  );
}
