import React, { useState, SyntheticEvent, FC } from 'react';
import { batchActions } from 'redux-batched-actions';
import { FcLock } from 'react-icons/fc';
import Loader from '../Loader/Loader';
import useAppDispatch from '../../hooks/useAppDispatch';
import Api from '../../api/api';
import { SYNC_ALL_CREDENTIALS, SET_ALERT } from '../../constants/actionTypes';

interface Props { }

const PasswordModal: FC<Props> = () => {
  const [password, setPassword] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const dispatch = useAppDispatch();

  const fetchAllCredentails = (event: SyntheticEvent) => {
    event.preventDefault();
    setLoading(true);
    Api.post('/export', { password })
      .then(response => {
        dispatch(batchActions([{
          type: SYNC_ALL_CREDENTIALS,
          payload: response.data.data
        }, {
          type: SET_ALERT,
          payload: { message: 'Success!', type: 'SUCCESS' }
        }]));
      }).catch(err => {
        console.log(err);
        dispatch({
          type: SET_ALERT,
          payload: { message: 'Failed, try again!', type: 'ERROR' }
        })
      }).finally(() => setLoading(false))
  }

  return (
    <div className="modal fixed w-full h-full top-0 left-0 flex items-center justify-center">
      <div className="modal-overlay absolute w-full h-full bg-gray-900 opacity-50"></div>
      <div className="modal-container bg-white w-11/12 md:max-w-md mx-auto rounded shadow-lg z-50 overflow-y-auto">
        <div className="modal-content m-2 flex flex-col justify-center items-center border-2 p-2
        ">
          <FcLock className="text-5xl" />
          <div className="text-lg font-semibold">
            Re-enter you last pass password below
          </div>
          <form onSubmit={fetchAllCredentails}>
            <section>
              <input
                className="p-1 pl-2 rounded-full italic mt-4 mb-4 font-bold 
                         text-red-600 w-64 focus:outline-none ring-2 focus:ring-red-500"
                onChange={(event) => setPassword(event.target.value)}
                type="password"
              />
            </section>
            <section className="flex justify-center">
              {loading ?
                <Loader />
                : <input
                  type='submit'
                  disabled={password.length === 0}
                  className={`bg-red-600 text-white font-bold py-2 
                                px-4 border border-red-700 rounded
                                ${password.length === 0 && "opacity-50"}`}
                  value='Submit'
                />
              }
            </section>
          </form>
        </div>
      </div>
    </div>);
}

export default PasswordModal;
