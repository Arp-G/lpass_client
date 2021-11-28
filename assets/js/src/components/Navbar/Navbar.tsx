import React, { FC } from 'react';
import { batchActions } from 'redux-batched-actions';
import Api from '../../api/api';
import useAppSelector from '../../hooks/useAppSelector';
import useAppDispatch from '../../hooks/useAppDispatch';
import { delMany } from "idb-keyval";
import { SET_ALERT, SIGN_OUT } from '../../constants/actionTypes';
import { MdLogout } from 'react-icons/md'

const Navbar: FC = () => {

  const token: string = useAppSelector(state => state.main.token);
  const dispatch = useAppDispatch();

  const logOut = async () => {
    try {
      await Api.post('/sign_out');

      // Remove token from idexDB
      await delMany(['token', 'allCredentails']);

      dispatch(batchActions([
        { type: SIGN_OUT },
        { type: SET_ALERT, payload: { message: 'Logged out successfully!', type: 'SUCCESS', timeout: 3000 } }
      ]));

    } catch (err) {
      console.log(err);
      dispatch({
        type: SET_ALERT,
        payload: { message: 'Something went wrong!', type: 'ERROR' }
      });
    }
  };

  return (
    <div className="flex sticky bottom-6 top-0 w-screen h-16 bg-red-600 font-semibold text-3xl justify-center items-center">
      <div className="m-auto"> Lastpass </div>
      {token && <div className="pr-2 cursor-pointer"> <MdLogout onClick={logOut} /> </div>}
    </div>
  );
};

export default Navbar;
