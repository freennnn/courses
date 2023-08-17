import { Outlet, useNavigate } from 'react-router-dom';
import { useContext } from 'react';

import { AuthContext } from '../../contexts/AuthContext';

const Navigation = () => {
  const { isSignedIn } = useContext(AuthContext);

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
