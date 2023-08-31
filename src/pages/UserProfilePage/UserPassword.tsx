/* eslint-disable no-console */
import { useState, useEffect } from 'react';
import './UserProfilePage.scss';
import { queryCustomer } from '../../api/api';
import { apiRoot } from '../../api/apiHelpers';
import { projectKey } from '../../api/apiConfig';

import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

import Modal from 'react-modal';

import { ApiErrorResponse } from '../../types.ts';
import { toastForNoConnection, toastUpdate } from './toasts.ts';
import { TOAST_INTERNAL_SERVER_ERROR, TOAST_PASSWORD_ERROR } from '../../constants.ts';
import { useContext } from 'react';
import { AuthContext } from '../../contexts/AuthContext.ts';
import { customStyles } from '../../components/Modal/Modal.tsx';
import { UserPasswordSchema } from '../../utils/schema.tsx';

type FormPassword = z.infer<typeof UserPasswordSchema>;
interface userPassword {
  password: string;
  oldpassword: string;
}

export default function UserPassword() {
  const [oldPassword, setOldPassword] = useState('Password1');
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
        if (body?.password) {
          const data: string = body.password;
          setOldPassword(data);
        }
      })
      .catch(console.error);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [modalIsOpen]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormPassword>({
    mode: 'onChange',
    resolver: zodResolver(UserPasswordSchema),
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

  const onSubmit: SubmitHandler<FormPassword> = async (data): Promise<void> => {
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
      <div className='user__info'>
        <h2>Password information</h2>
        <p>password: {oldPassword}</p>
        <button className='user__btn' onClick={openModal}>
          Change password
        </button>
      </div>

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
          <form className='user__info-form' autoComplete='off' onSubmit={handleSubmit(onSubmit)}>
            <div>
              <div>
                <label htmlFor='password' className='user-form__label-pass'>
                  Old Password
                  <input
                    {...register('oldpassword')}
                    type={passStyle}
                    id='oldpassword'
                    className={`user-form__input ${signUpError ? 'server-error' : ''}`}
                  />
                  <div onClick={togglePass} className='user-form__view'>
                    👁️
                  </div>
                </label>
                <label htmlFor='password' className='user-form__label-pass'>
                  Password
                  <input
                    {...register('password')}
                    type={passStyle}
                    id='password'
                    className='user-form__input'
                  />
                  <div onClick={togglePass} className='user-form__view'>
                    👁️
                  </div>
                </label>
                {errors.password && (
                  <span className='user-form__error'>{errors.password.message}</span>
                )}
              </div>
              <div>
                <label htmlFor='confirmPassword' className='user-form__label-pass'>
                  Confirm Password:
                  <input
                    type={passStyleConfirm}
                    {...register('confirmPassword')}
                    id='conformPassword'
                    className='user-form__input'
                  />
                  <div onClick={togglePassConfirm} className='user-form__view'>
                    👁️
                  </div>
                </label>
                {errors.confirmPassword && (
                  <span className='user-form__error'>{errors.confirmPassword?.message}</span>
                )}
              </div>
            </div>
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

const customerChangePassword = (
  customerID: string,
  userPassword: userPassword,
  version: number,
) => {
  return apiRoot
    .withProjectKey({ projectKey })
    .customers()
    .password()
    .post({
      // The CustomerUpdate is the object within the body
      body: {
        // The version of a new Customer is 1. This value is incremented every time an update action is applied to the Customer. If the specified version does not match the current version, the request returns an error.
        id: customerID,
        version: version,
        currentPassword: userPassword.oldpassword,
        newPassword: userPassword.password,
      },
    })
    .execute();
};
