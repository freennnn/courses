import * as z from 'zod';

export const RegistrationFormSchema = z
  .object({
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
    isChecked: z.boolean(),
    street: z.string().trim().nonempty(' is required to complete'),
    street2: z.string().trim().nonempty(' is required to complete'),
    city: z
      .string()
      .trim()
      .min(1, { message: ' must contain at least one character' })
      .regex(/^(([a-zA-Z])(\s[a-zA-Z])?)+$/, ' must contain only letters of the Latin alphabet'),
    city2: z
      .string()
      .trim()
      .min(1, { message: ' must contain at least one character' })
      .regex(/^(([a-zA-Z])(\s[a-zA-Z])?)+$/, ' must contain only letters of the Latin alphabet'),
    country: z.string().nonempty('Country is required to complete'),
    country2: z.string().nonempty('Country is required to complete'),
    zip: z.string().trim().nonempty(' is required to complete'),
    zip2: z.string().trim().nonempty(' is required to complete'),
    addressDefault: z.boolean(),
    addressDefault2: z.boolean(),
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

export const LoginFormSchema = z.object({
  email: z.string().nonempty(' is required').email({
    message: ' is invalid. Please enter a valid email address(e.g., user@example.com)',
  }),
  password: z
    .string()
    .nonempty(' is required')
    .min(8, 'Password must have at least 8 characters')
    .regex(/[0-9]/, 'Your password must have at least 1 digit character')
    .regex(/[a-z]/, 'Your password must have at least 1 lowercase character')
    .regex(/[A-Z]/, 'Your password must have at least 1 uppercasecharacter'),
});

export const UserInfoSchema = z.object({
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

export const UserPasswordSchema = z
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

export const UserAddressSchema = z.object({
  street: z.string().trim().nonempty(' is required to complete'),
  city: z
    .string()
    .trim()
    .min(1, { message: ' must contain at least one character' })
    .regex(/^(([a-zA-Z])(\s[a-zA-Z])?)+$/, ' must contain only letters of the Latin alphabet'),
  country: z.string().nonempty('Country is required to complete'),
  zip: z.string().trim().nonempty(' is required to complete'),
});

export const UserNewAddressSchema = z.object({
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
