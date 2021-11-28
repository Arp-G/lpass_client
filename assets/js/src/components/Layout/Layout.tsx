import React, { FC, useEffect } from 'react';
import useAppDispatch from '../../hooks/useAppDispatch';
import useAppSelector from '../../hooks/useAppSelector';
import PasswordModal from '../PasswordModal/PasswordModal';
import Navbar from '../Navbar/Navbar';
import Alert from '../Alert/Alert';
import { CredentialsHash, AlertType } from '../../Types/Types';
import { SET_SYNC_MODAL, CLEAR_ALERT } from '../../constants/actionTypes';

interface Props {
  // any props that come into the component
}
const Layout: FC<Props> = ({ children }) => {
  const dispatch = useAppDispatch();
  const [token, allCredentials, syncModal, alert]: [string, CredentialsHash, boolean, AlertType]
    = useAppSelector((state) => [state.main.token, state.main.allCredentials, state.main.syncModal, state.main.alert]);

  useEffect(() => {
    if (token && Object.keys(allCredentials).length === 0) {
      dispatch({ type: SET_SYNC_MODAL, payload: true })
    }
  }, []);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    if (alert)
      timer = setTimeout(() => dispatch({ type: CLEAR_ALERT }), alert.timeout || 5000);

    return () => clearTimeout(timer);
  }, [alert]);

  return (
    <div>
      <Navbar />
      {syncModal && <PasswordModal />}
      {children}
      <Alert {...alert} />
    </div>
  );
};

export default Layout;
