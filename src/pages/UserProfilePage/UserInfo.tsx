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
import { TOAST_INTERNAL_SERVER_ERROR, TOAST_SIGN_UP_ERROR } from '../../constants.ts';

import { useContext } from 'react';
import { AuthContext } from '../../contexts/AuthContext.ts';
import { customStyles } from '../../components/Modal/Modal.tsx';

interface userInfo {
  email: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
}

const UserInfoSchema = z.object({
  firstName: z
    .string()
    .trim()
    .min(1, { message: '  must contain at least one character' })
    .regex(/^[a-zA-Z]+$/, ' must contain only letters of the Latin alphabet'),
  lastName: z
    .string()
    .trim()
    .min(1, { message: ' must contain at least one character' })
    .regex(/^[a-zA-Z]+$/, ' must contain only letters of the Latin alphabet'),
  email: z.string().nonempty(' is required to complete').email({
    message: ' is invalid. Please enter a valid email address(e.g., user@example.com)',
  }),
  dateOfBirth: z.coerce
    .date()
    .min(new Date(1920, 0, 1), {
      message: ' cannot go past January 1 1923',
    })
    .max(new Date(), { message: ' must be in the past' })
    .refine(
      (date: Date) => {
        const ageTime = new Date(Date.now() - date.getTime());
        const age = Math.abs(ageTime.getUTCFullYear() - 1970);
        return age >= 18;
      },
      { message: 'You must be 18 years or older' },
    ),
});

type FormEditUserInfo = z.infer<typeof UserInfoSchema>;

export default function UserInfo() {
  const [firstName1, setFirstName] = useState<string>('John');
  const [lastName1, setLastName] = useState<string>('Doy');
  const [email1, setEmail] = useState<string>('email@ex.com');
  const [dateOfBirth1, setdateOfBirth] = useState<string>('01.01.1980');
  const [version, setVersion] = useState<number>(1);

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

        if (body?.firstName) {
          const data: string = body.firstName;
          setFirstName(data);
        }
        if (body?.lastName) {
          setLastName(body.lastName);
        }
        if (body?.email) {
          setEmail(body.email);
        }
        if (body?.dateOfBirth) {
          setdateOfBirth(body.dateOfBirth);
        }
      })
      .catch(console.error);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [modalIsOpen]);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormEditUserInfo>({
    mode: 'onChange',
    resolver: zodResolver(UserInfoSchema),
  });

  useEffect(() => {
    setValue('firstName', firstName1);
  }, [firstName1, setValue]);

  useEffect(() => {
    setValue('lastName', lastName1);
  }, [lastName1, setValue]);

  useEffect(() => {
    setValue('email', email1);
  }, [email1, setValue]);

  useEffect(() => {
    setValue('dateOfBirth', new Date(dateOfBirth1));
  }, [dateOfBirth1, setValue]);

  const [signUpError, setSignUpError] = useState<null | ApiErrorResponse>(null);

  const onRenderError = (error: ApiErrorResponse) => {
    if (error.data.body.statusCode === 400) {
      setSignUpError(error);
      return TOAST_SIGN_UP_ERROR;
    } else {
      return TOAST_INTERNAL_SERVER_ERROR;
    }
  };

  const onSubmit: SubmitHandler<FormEditUserInfo> = async (data): Promise<void> => {
    const userInfo: userInfo = {
      email: data.email,
      firstName: data.firstName,
      lastName: data.lastName,
      dateOfBirth: data.dateOfBirth.toISOString().slice(0, 10),
    };
    try {
      if (toastForNoConnection()) {
        return;
      }
      setSignUpError(null);
      await toastUpdate(onRenderError, () => updateCustomerInfo(userId, userInfo, version));
      closeModal();
    } catch (error) {
      const apiError = error as ApiErrorResponse;
      console.error(apiError);
    }
  };

  return (
    <>
      <div className='user__info'>
        <h2>Person information</h2>
        <p>First name: {firstName1}</p>
        <p>Last name: {lastName1}</p>
        <p>Email: {email1}</p>
        <p>Date of birth: {dateOfBirth1}</p>
        <button className='user__btn' onClick={openModal}>
          Edit
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
              <label htmlFor='firstname'>First Name</label>
              {errors?.firstName?.message && (
                <span className='user-form__error'>{errors.firstName.message}</span>
              )}
              <input
                id='firstname'
                {...register('firstName')}
                className='user-form__input'
                placeholder=''
              />
            </div>
            <div>
              <label htmlFor='lastname'>Last Name</label>
              {errors?.lastName?.message && (
                <span className='user-form__error'>{errors.lastName.message}</span>
              )}
              <input
                id='lastname'
                {...register('lastName')}
                className='user-form__input'
                placeholder=''
              />
            </div>

            <div>
              <label htmlFor='email'>Email</label>
              {errors?.email?.message && (
                <span className='user-form__error'>{errors.email.message}</span>
              )}
              <input
                id='email'
                {...register('email')}
                className={`user-form__input ${signUpError ? 'server-error' : ''}`}
                placeholder=''
              />
            </div>

            <div>
              <label htmlFor='dateOfBirth'>Date of birth</label>
              {errors?.dateOfBirth?.message && (
                <span className='user-form__error'>{errors.dateOfBirth.message}</span>
              )}
              <input
                id='dateOfBirth'
                type='date'
                {...register('dateOfBirth')}
                className='user-form__input'
              />
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

const updateCustomerInfo = (userId: string, userInfo: userInfo, version: number) => {
  return apiRoot
    .withProjectKey({ projectKey })
    .customers()
    .withId({ ID: userId })
    .post({
      // The CustomerUpdate is the object within the body
      body: {
        // The version of a new Customer is 1. This value is incremented every time an update action is applied to the Customer. If the specified version does not match the current version, the request returns an error.
        version: version,
        actions: [
          {
            action: 'setFirstName',
            firstName: userInfo.firstName,
          },
          {
            action: 'setLastName',
            lastName: userInfo.lastName,
          },
          {
            action: 'changeEmail',
            email: userInfo.email,
          },
          {
            action: 'setDateOfBirth',
            dateOfBirth: userInfo.dateOfBirth,
          },
        ],
      },
    })
    .execute();
};
