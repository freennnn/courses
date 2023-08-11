import './App.css';
import { signUp, signIn } from './api/api';

//temporary user for testing
const customer = {
  email: 'user6',
  password: 'password',
  firstName: 'John',
  lastName: 'Doe',
  dateOfBirth: '2000-10-12',
  addresses: [{ country: 'US' }],
};

function App() {
  //temporary example for testing
  signIn({ email: 'user4', password: 'password' })
    .then((response) => {
      // eslint-disable-next-line no-console
      console.log('Sign Up Response:', response);
    })
    .catch((error) => {
      // eslint-disable-next-line no-console
      console.error('Sign Up Error:', error);
    });

  //temporary function for testing
  const handleSignUp = () => {
    signUp(customer)
      .then((response) => {
        // eslint-disable-next-line no-console
        console.log('Sign Up Response:', response);
      })
      .catch((error) => {
        // eslint-disable-next-line no-console
        console.error('Sign Up Error:', error);
      });
  };
  return (
    <>
      <p>Here will be App content</p>
      <button onClick={handleSignUp}>Sign up</button>
    </>
  );
}

export default App;
