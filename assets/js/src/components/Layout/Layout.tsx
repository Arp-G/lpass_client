import React, { FC, useEffect } from 'react';
import useAppDispatch from '../../hooks/useAppDispatch';
import useAppSelector from '../../hooks/useAppSelector';
import { CLEAR_ALERT } from '../../constants/actionTypes';
import Alert from '../Alert/Alert';

// import { useLocation } from 'react-router-dom';
import Navbar from '../Navbar/Navbar';

interface Props {
  // any props that come into the component
}
const Layout: FC<Props> = ({ children }) => {
  const dispatch = useAppDispatch();
  const alert = useAppSelector(state => state.main.alert);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    if (alert)
      timer = setTimeout(() => dispatch({ type: CLEAR_ALERT }), alert.timeout || 5000);

    return () => clearTimeout(timer);
  }, [alert]);

  return (
    <div className="w-screen h-screen">
      <Navbar />
      {children}
      <Alert {...alert} />
    </div>
  );
};

export default Layout;
