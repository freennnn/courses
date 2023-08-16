import * as React from 'react';
import { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import './LoginForm.scss';
import { signIn } from '../../api/api.ts';
import { toast } from 'react-toastify';
import { ApiErrorResponse } from '../../types.ts';

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

type FormInput = z.infer<typeof FormSchema>;

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

  const [passStyle, setPassStyle] = React.useState('password');
  const [signInError, setSignInError] = useState<null | ApiErrorResponse>(null);

  const onSubmit: SubmitHandler<FormInput> = async (data): Promise<void> => {
    try {
      if (!navigator.onLine) {
        toast.error('No internet connection. Please check your network.');
        return;
      }

      setSignInError(null);

      await toast.promise(signIn(data), {
        pending: 'Signing in...',
        success: 'Sign in successful!',
        error: {
          render(error) {
            const apiError = error as ApiErrorResponse;

            if (apiError.data.body.statusCode === 400) {
              setSignInError(apiError);
              return 'Incorrect login or password. Please try again!';
            } else {
              return 'Internal server error. Please try again!';
            }
          },
        },
      });
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
