import { Outlet, useNavigate } from 'react-router-dom';
import { useContext } from 'react';

import { AppContext } from '../../contexts/AppContext';

const Navigation = () => {
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
      <Outlet />
    </>
  );
};

export default Navigation;
