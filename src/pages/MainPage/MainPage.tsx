import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../../contexts/AppContext';

const MainPage = () => {
  const { isSignedIn } = useContext(AppContext);

  const navigate = useNavigate();

  const handleLoginClick = () => {
    if (isSignedIn) {
      navigate('/');
    } else {
      navigate('/login');
    }
  };
  return (
    <>
      <button onClick={handleLoginClick}>Login</button>
      <p>Main Page</p>
    </>
  );
};

export default MainPage;
