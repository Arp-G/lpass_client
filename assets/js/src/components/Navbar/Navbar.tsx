import React, { FC } from 'react';
import { useHistory } from "react-router-dom";
import Api from '../../api/api';
import useAppSelector from '../../hooks/useAppSelector';
import useAppDispatch from '../../hooks/useAppDispatch';
import { usePersistedState } from '../../hooks/usePersistedState';
import { SET_ALERT, SIGN_OUT } from '../../constants/actionTypes';
import { MdLogout } from 'react-icons/md'

const Navbar: FC = () => {

  const token: string = useAppSelector(state => state.main.token);
  const dispatch = useAppDispatch();
  const history = useHistory();
  // Custom hook to fetch and save auth token to indexDB
  const [_token, setToken] = usePersistedState<string | undefined>('token', undefined);

  const logOut = async () => {
    try {
      await Api.post('/sign_out');

      // Remove token from store
      dispatch({ type: SIGN_OUT });

      // Remove token from idexDB
      setToken(undefined);

      dispatch({
        type: SET_ALERT,
        payload: { message: 'Logged out successfully!', type: 'SUCCESS', timeout: 3000 }
      });

    } catch (err) {
      console.log(err);
      dispatch({
        type: SET_ALERT,
        payload: { message: 'Something went wrong!', type: 'ERROR' }
      });
    }
  };

  return (
    <div className="flex w-screen h-16 bg-red-600 font-semibold text-3xl justify-center items-center">
      <div className="m-auto"> Lastpass </div>
      {token && <div className="pr-2 cursor-pointer"> <MdLogout onClick={logOut} /> </div>}
    </div>
  );
};

export default Navbar;
