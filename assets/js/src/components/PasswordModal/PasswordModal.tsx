import React, { useState, SyntheticEvent, FC } from 'react';
import { batchActions } from 'redux-batched-actions';
import { FcLock } from 'react-icons/fc';
import { AiOutlineCloseCircle } from 'react-icons/ai'
import Loader from '../Loader/Loader';
import useAppDispatch from '../../hooks/useAppDispatch';
import Api from '../../api/api';
import { SYNC_ALL_CREDENTIALS, SET_SYNC_MODAL, SET_ALERT } from '../../constants/actionTypes';
import { usePersistedState } from '../../hooks/usePersistedState';

interface Props { }

const PasswordModal: FC<Props> = () => {
  const [password, setPassword] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const dispatch = useAppDispatch();
  const [_allCrendentails, setAllCredentials] = usePersistedState<Credential[] | undefined>('allCredentials', undefined);

  const fetchAllCredentials = (event: SyntheticEvent) => {
    event.preventDefault();
    setLoading(true);
    Api.post('/export', { password })
      .then(response => {
        // Save in index db
        setAllCredentials(response.data.data);

        dispatch(batchActions([{
          type: SYNC_ALL_CREDENTIALS,
          payload: response.data.data
        },
        { type: SET_SYNC_MODAL, payload: false },
        {
          type: SET_ALERT,
          payload: { message: 'Success!', type: 'SUCCESS' }
        }]));
      }).catch(err => {
        console.log(err);
        dispatch({
          type: SET_ALERT,
          payload: { message: 'Failed, try again!', type: 'ERROR' }
        })

        setLoading(false);
      });
  }

  return (
    <div className="modal fixed w-full h-full top-0 left-0 flex items-center justify-center">
      <div className="modal-overlay absolute w-full h-full bg-gray-900 opacity-50"></div>
      <div className="modal-container border-4 bg-white w-11/12 h-64 md:max-w-md mx-auto rounded shadow-lg z-50 overflow-y-auto">
        <div className="flex flex-row h-4">
          {
            !loading && <AiOutlineCloseCircle
              className=" text-2xl mt-1 mr-1 ml-auto cursor-pointer"
              onClick={() => dispatch({ type: SET_SYNC_MODAL, payload: false })}
            />
          }
        </div>
        <div className="modal-content flex flex-col justify-center items-center p-2">
          <FcLock className="text-5xl" />
          <div className="text-md font-semibold italic text-center">
            Enter you lastpass master password below to synchronise credentials
          </div>
          <form onSubmit={fetchAllCredentials}>
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
