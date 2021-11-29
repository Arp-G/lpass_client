import React, { useState, useEffect, FC } from 'react';
import { useHistory } from 'react-router';
import { RiAddCircleFill } from 'react-icons/ri';
import { HiSortDescending } from 'react-icons/hi';
import { BiSync } from 'react-icons/bi';
import { FaRegPaperPlane } from 'react-icons/fa';
import useAppSelector from '../../hooks/useAppSelector';
import useAppDispatch from '../../hooks/useAppDispatch';
import CredentialItem from '../CredentialItem/CredentialItem';
import SortModal from '../SortModal/SortModal';
import { SET_SYNC_MODAL } from '../../constants/actionTypes';
import { SortOrder, CredentialsHash } from '../../Types/Types';

interface Props {
  // any props that come into the component
}

const Home: FC<Props> = () => {
  const allCredentials: CredentialsHash = useAppSelector(state => state.main.allCredentials);
  const dispatch = useAppDispatch();
  const history = useHistory();
  const [searchString, setSearchString] = useState<string>('');
  const [sortModal, setSortModal] = useState<boolean>(false);
  const [sortOrder, setSortOrder] = useState<SortOrder>('A-Z');

  useEffect(() => {
    if (Object.keys(allCredentials).length === 0)
      dispatch({ type: SET_SYNC_MODAL, payload: true });
  }, [allCredentials])

  return (
    <div>
      <div className="border-2 flex justify-between bg-gray-200 sticky top-16 w-screen">
        <input
          type="text"
          name="name"
          placeholder="Search..."
          className="m-2 p-2 w-11/12 rounded-full italic focus:outline-none ring-2 focus:ring-red-500"
          onChange={(event) => setSearchString(event.target.value)}
          value={searchString}
        />
        <HiSortDescending
          className="text-3xl self-center mr-1.5 cursor-pointer"
          onClick={() => setSortModal(true)}
        />
      </div>
      {sortModal &&
        <SortModal
          setSortModal={setSortModal}
          setSortOrder={setSortOrder}
          sortOrder={sortOrder}
        />}
      {Object.keys(allCredentials).length === 0
        ?
        <div className="h-96 flex flex-col justify-center items-center">
          <div className="text-center text-lg font-semibold italic">
            No credentials found, click on <BiSync className="text-2xl font-bold text-center inline" /> to sync with server.
          </div>
          <div>
            <FaRegPaperPlane className="text-6xl text-red-500" />
          </div>
        </div>
        : <ul>
          {
            Object.values(allCredentials)
              .filter(cred => {
                const searchStr = searchString.toLowerCase()
                return cred?.name?.toLowerCase()?.includes(searchStr) ||
                  cred?.username?.toLowerCase()?.includes(searchStr) ||
                  cred?.url?.toLowerCase()?.includes(searchStr);
              })
              .sort((cred1, cred2) => {
                if (sortOrder === 'TIME' && cred1.last_touch && cred2.last_touch)
                  return new Date(cred1.last_touch).getTime() - new Date(cred2.last_touch).getTime();
                else
                  return cred1.name.localeCompare(cred2.name);
              })
              .map(({ id, name }) =>
                <CredentialItem
                  key={id}
                  data={{ ...allCredentials[id], id, name }}
                />)
          }
        </ul>
      }
      <RiAddCircleFill
        className="fixed bottom-6 right-3 text-6xl text-red-600 z-10"
        onClick={() => history.push("/credentials/123")}
      />
    </div>
  );
};

export default Home;
