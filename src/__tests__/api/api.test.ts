import { CustomerDraft, CustomerSignin } from '@commercetools/platform-sdk';

import { signIn, signUp } from '../../api/api';

const singInStub: CustomerSignin = {
  email: 'testUser@gmail.com',
  password: 'notYourAveragePassword',
};

const singUpMock: CustomerDraft = {
  email: 'testUser@gmail.com',
  password: 'notYourAveragePassword',
};

test('signIn function', async () => {
  const data = await signIn(singInStub);
  expect(data).toBeInstanceOf('CustomerSignInResult');
});

test('signUp', async () => {
  const data = await signUp(singUpMock);
  expect(data).toBeInstanceOf('CustomerSignInResult');
});
