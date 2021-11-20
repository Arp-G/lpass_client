import React, { FC } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useLocation } from 'react-router-dom';
import Navbar from '../Navbar/Navbar';

interface Props {
  // any props that come into the component
}
const Layout: FC<Props> = ({ children }) => {
  const dispatch = useDispatch();
  const location = useLocation();
  // const { alertType, msg } = useSelector(state => state.settings.alert);

  return (
    <div className="w-screen h-screen">
      <Navbar />
      {children}
    </div>
  );
};

export default Layout;