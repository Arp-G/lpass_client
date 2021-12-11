import React, { FC } from 'react';
import { MdLogout } from 'react-icons/md'
import { BiSync } from 'react-icons/bi';
import { Credential } from '../../Types/Types';
import { setSyncModal, fetchAllCredentials, signOut } from '../../actions/index';
import useAppSelector from '../../hooks/useAppSelector';
import useAppDispatch from '../../hooks/useAppDispatch';
import usePersistedState from '../../hooks/usePersistedState';

const Navbar: FC = () => {
  const [token, lastpass, syncying]: [string, string, boolean] = useAppSelector(state => [state.main.token, state.main.lastpass, state.main.syncying]);
  const dispatch = useAppDispatch();
  const [_allCrendentails, setAllCredentials] = usePersistedState<Credential[] | undefined>('allCredentials', undefined);
  const dispatchSignOut = signOut(dispatch, true);
  const dispatchfetchAllCredentials = fetchAllCredentials(dispatch);
  const dispatchSetSyncModal = setSyncModal(dispatch);

  const startSync = () => {
    if (syncying) return;

    if (lastpass) dispatchfetchAllCredentials(lastpass, setAllCredentials)
    else dispatchSetSyncModal(true);
  }

  return (
    <div className="flex sticky bottom-6 top-0 w-screen h-16 bg-red-600 font-semibold text-3xl justify-center items-center">
      <div className="m-auto relative left-6 text-3xl italic"> Lastpass </div>
      {
        token &&
        <div className="pr-2 cursor-pointer">
          <BiSync onClick={startSync} className={`origin-center ${syncying && 'animate-spin-slow'}`} />
        </div>
      }
      {
        token &&
        <div className="pr-2 cursor-pointer">
          <MdLogout onClick={dispatchSignOut} />
        </div>
      }
    </div>
  );
};

export default Navbar;
