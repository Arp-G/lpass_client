import React, { FC } from 'react';
import { MdLogout, MdOutlineCloudOff } from 'react-icons/md'
import { BiSync } from 'react-icons/bi';
import { FaSun, FaMoon } from 'react-icons/fa';
import { Credential } from '../../Types/Types';
import { setSyncModal, fetchAllCredentials, signOut, toggleDarkMode } from '../../actions/index';
import useAppSelector from '../../hooks/useAppSelector';
import useAppDispatch from '../../hooks/useAppDispatch';
import usePersistedState from '../../hooks/usePersistedState';

const Navbar: FC = () => {
  const [online, token, lastpass, syncing, darkMode]: [boolean, string, string, boolean, boolean] =
    useAppSelector(state => [state.main.online, state.main.token, state.main.lastpass, state.main.syncing, state.main.darkMode]);
  const dispatch = useAppDispatch();
  const [_allCredentials, setAllCredentials] = usePersistedState<Credential[] | undefined>('allCredentials', undefined);
  const dispatchSignOut = signOut(dispatch, true);
  const dispatchFetchAllCredentials = fetchAllCredentials(dispatch);
  const dispatchSetSyncModal = setSyncModal(dispatch);
  const dispatchToggleDarkMode = toggleDarkMode(dispatch);

  const startSync = () => {
    if (syncing) return;

    if (lastpass) dispatchFetchAllCredentials(lastpass, setAllCredentials)
    else dispatchSetSyncModal(true);
  }

  return (
    <div className="flex sticky w-full bottom-6 top-0 h-16 bg-red-600 font-semibold text-3xl justify-center items-center">
      {token &&
        <div className="w-9 text-center rounded-full bg-white ml-2 border-2" onClick={dispatchToggleDarkMode}>
          {darkMode ? <FaSun className="text-yellow-600" /> : <FaMoon className="text-blue-900" />}
        </div>
      }

      {
        !online &&
        <div className="w-9 rounded-full bg-white ml-2 border-2" title="You are offline" >
          <MdOutlineCloudOff className="text-red-500 text-center" />
        </div>
      }

      <div className={`m-auto ${token ? 'relative left-4' : ''} text-3xl italic`}> Lastpass </div>
      {
        token && online &&
        <div className="pr-2 cursor-pointer">
          <BiSync onClick={startSync} className={`origin-center ${syncing && 'animate-spin-slow'}`} />
        </div>
      }
      {
        token &&
        <div className="pr-2 cursor-pointer mr-3">
          <MdLogout onClick={dispatchSignOut} />
        </div>
      }
    </div>
  );
};

export default Navbar;
