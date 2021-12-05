import React, { FC } from 'react';
import { MdLogout } from 'react-icons/md'
import { BiSync } from 'react-icons/bi';
import { setSyncModal, signOut } from '../../actions/index';
import useAppSelector from '../../hooks/useAppSelector';
import useAppDispatch from '../../hooks/useAppDispatch';

const Navbar: FC = () => {
  const token: string = useAppSelector(state => state.main.token);
  const dispatch = useAppDispatch();
  const logout = signOut(dispatch, true);
  const openSyncModal = setSyncModal(dispatch);

  return (
    <div className="flex sticky bottom-6 top-0 w-screen h-16 bg-red-600 font-semibold text-3xl justify-center items-center">
      <div className="m-auto"> Lastpass </div>
      {
        token &&
        <div className="pr-2 cursor-pointer">
          <BiSync onClick={() => openSyncModal(true)} />
        </div>
      }
      {
        token &&
        <div className="pr-2 cursor-pointer">
          <MdLogout onClick={logout} />
        </div>
      }
    </div>
  );
};

export default Navbar;
