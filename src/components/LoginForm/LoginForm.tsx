import { useState, useContext } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useNavigate } from 'react-router-dom';

import { signIn } from '../../api/api.ts';
import { LoginFormSchema } from '../../utils/schema.tsx';
import { ApiErrorResponse } from '../../types.ts';
import { toastForNoConnection, toastSignIn } from './toasts.ts';
import { AuthContext, updateAuthContext } from '../../contexts/AuthContext.ts';
import { TOAST_INTERNAL_SERVER_ERROR, TOAST_SIGN_IN_ERROR } from '../../constants.ts';

import './LoginForm.scss';

export type FormInput = z.infer<typeof LoginFormSchema>;

export default function Form() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormInput>({
    mode: 'onChange',
    resolver: zodResolver(LoginFormSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });
  const authContext = useContext(AuthContext);
  const [passStyle, setPassStyle] = useState('password');
  const [signInError, setSignInError] = useState<null | ApiErrorResponse>(null);

  const navigate = useNavigate();

  const onRenderError = (error: ApiErrorResponse) => {
    if (error.data.body.statusCode === 400) {
      setSignInError(error);
      return TOAST_SIGN_IN_ERROR;
    } else {
      return TOAST_INTERNAL_SERVER_ERROR;
    }
  };

  const onSubmit: SubmitHandler<FormInput> = async (data): Promise<void> => {
    try {
      if (toastForNoConnection()) {
        return;
      }

      setSignInError(null);
      const response = await toastSignIn(onRenderError, () => signIn(data));
      reset();
      updateAuthContext(authContext, { isSignedIn: true, id: response.body.customer.id });
      navigate('/', { replace: true });
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
    <form className='reg-form' autoComplete='off' onSubmit={handleSubmit(onSubmit)}>
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
