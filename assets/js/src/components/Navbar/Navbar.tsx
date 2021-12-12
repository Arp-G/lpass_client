import React, { FC } from 'react';
import { MdLogout } from 'react-icons/md'
import { BiSync } from 'react-icons/bi';
import { FaSun, FaMoon } from 'react-icons/fa';
import { Credential } from '../../Types/Types';
import { setSyncModal, fetchAllCredentials, signOut, toggleDarkMode } from '../../actions/index';
import useAppSelector from '../../hooks/useAppSelector';
import useAppDispatch from '../../hooks/useAppDispatch';
import usePersistedState from '../../hooks/usePersistedState';

const Navbar: FC = () => {
  const [token, lastpass, syncying, darkMode]: [string, string, boolean, boolean] =
    useAppSelector(state => [state.main.token, state.main.lastpass, state.main.syncying, state.main.darkMode]);
  const dispatch = useAppDispatch();
  const [_allCrendentails, setAllCredentials] = usePersistedState<Credential[] | undefined>('allCredentials', undefined);
  const dispatchSignOut = signOut(dispatch, true);
  const dispatchfetchAllCredentials = fetchAllCredentials(dispatch);
  const dispatchSetSyncModal = setSyncModal(dispatch);
  const dispatchToggleDarkMode = toggleDarkMode(dispatch);

  const startSync = () => {
    if (syncying) return;

    if (lastpass) dispatchfetchAllCredentials(lastpass, setAllCredentials)
    else dispatchSetSyncModal(true);
  }

  return (
    <div className="flex sticky bottom-6 top-0 w-screen h-16 bg-red-600 font-semibold text-3xl justify-center items-center">
      <div className="w-9 text-center rounded-full bg-white ml-2 border-2" onClick={dispatchToggleDarkMode}>
        {darkMode ? <FaSun className="text-yellow-600" /> : <FaMoon className="text-blue-900" />}
      </div>

      <div className={`m-auto ${token ? 'relative left-4' : ''} text-3xl italic`}> Lastpass </div>
      {
        token &&
        <div className="pr-2 cursor-pointer">
          <BiSync onClick={startSync} className={`origin-center ${syncying && 'animate-spin-slow'}`} />
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
