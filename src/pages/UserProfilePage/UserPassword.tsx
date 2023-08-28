/* eslint-disable no-console */
import { useState } from 'react';
import './UserProfilePage.scss';
import { queryCustomer } from '../../api/api';
import { customerChangePassword } from '../../api/api';

import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

import Modal from 'react-modal';

import { ApiErrorResponse } from '../../types.ts';
import { toastForNoConnection, toastUpdate } from './toasts.ts';
import { TOAST_INTERNAL_SERVER_ERROR, TOAST_PASSWORD_ERROR } from '../../constants.ts';
import { signIn } from '../../api/api.ts';
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

const FormSchema = z
  .object({
    oldpassword: z
      .string()
      .trim()
      .min(8, 'Password must have at least 8 characters')
      .regex(/[0-9]/, 'Password must have at least 1 digit character')
      .regex(/[a-z]/, 'Password must have at least 1 lowercase character')
      .regex(/[A-Z]/, 'Password must have at least 1 uppercase character'),
    password: z
      .string()
      .trim()
      .min(8, 'Password must have at least 8 characters')
      .regex(/[0-9]/, 'Password must have at least 1 digit character')
      .regex(/[a-z]/, 'Password must have at least 1 lowercase character')
      .regex(/[A-Z]/, 'Password must have at least 1 uppercase character'),

    confirmPassword: z.string().min(8, { message: 'Password must be at least 8 characters' }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Passwords do not match',
  });

type FormRegistr = z.infer<typeof FormSchema>;

interface userPassword {
  password: string;
  oldpassword: string;
}

export default function UserPassword() {
  const [oldPassword, setOldPassword] = useState<string>('Password1');
  const [version, setVersion] = useState<number>(1);
  const [email, setEmail] = useState<string>('email@gmail.com');

  const authContext = useContext(AuthContext);
  const userId = authContext.id;

  queryCustomer(userId)
    .then(({ body }) => {
      if (body?.version) {
        let data: number = body.version;
        setVersion(data++);
      }
      if (body?.password) {
        const data: string = body.password;
        setOldPassword(data);
      }
      if (body?.email) {
        const data: string = body.email;
        setEmail(data);
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

  type PasswordView = 'text' | 'password';

  const [passStyle, setPassStyle] = useState<PasswordView>('password');
  const [passStyleConfirm, setPassConfirmStyle] = useState<PasswordView>('password');

  const [signUpError, setSignUpError] = useState<null | ApiErrorResponse>(null);

  const onRenderError = (error: ApiErrorResponse) => {
    if (error.data.body.statusCode === 400) {
      setSignUpError(error);
      return TOAST_PASSWORD_ERROR;
    } else {
      return TOAST_INTERNAL_SERVER_ERROR;
    }
  };

  const onSubmit: SubmitHandler<FormRegistr> = async (data): Promise<void> => {
    const userPassword: userPassword = {
      password: data.password,
      oldpassword: data.oldpassword,
    };
    try {
      if (toastForNoConnection()) {
        return;
      }
      setSignUpError(null);
      await toastUpdate(onRenderError, () => customerChangePassword(userId, userPassword, version));
      closeModal();
      await signIn({ email: email, password: userPassword.password });
    } catch (error) {
      const apiError = error as ApiErrorResponse;
      console.error(apiError);
    }
  };

  const togglePass = (): void => {
    passStyle === 'password' ? setPassStyle('text') : setPassStyle('password');
  };

  const togglePassConfirm = (): void => {
    passStyleConfirm === 'password' ? setPassConfirmStyle('text') : setPassConfirmStyle('password');
  };

  return (
    <>
      <div className='user__person user__flex'>
        <div className='user__info'>
          <h2>Password infomation</h2>
          <p>password: {oldPassword}</p>
          <button onClick={openModal}>Edit</button>
        </div>

        <div>
          <Modal
            isOpen={modalIsOpen}
            onRequestClose={closeModal}
            style={customStyles}
            contentLabel='Example Modal'
          >
            <button onClick={closeModal}>close</button>
            <form className='user__info-form' autoComplete='off' onSubmit={handleSubmit(onSubmit)}>
              <div className='reg-form__flex'>
                <div>
                  <label htmlFor='password' className='reg-form__label-pass'>
                    Old Password
                    <input
                      {...register('oldpassword')}
                      type={passStyle}
                      id='oldpassword'
                      className={`reg-form__input ${signUpError ? 'server-error' : ''}`}
                    />
                    <div onClick={togglePass} className='reg-form__view'>
                      👁️
                    </div>
                  </label>
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
                  {errors.password && (
                    <span className='reg-form__error'>{errors.password.message}</span>
                  )}
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

              <button type='submit'>Submit</button>
            </form>
          </Modal>
        </div>
      </div>
    </>
  );
}
