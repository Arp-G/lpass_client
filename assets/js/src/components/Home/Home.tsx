import React, { useState, useEffect, FC } from 'react';
import { RiAddCircleFill } from 'react-icons/ri';
import useAppSelector from '../../hooks/useAppSelector';
import PasswordModal from '../PasswordModal/PasswordModal';
import CredentialItem from '../CredentialItem/CredentialItem';
import { CredentialsHash } from '../../Types/Types';

interface Props {
  // any props that come into the component
}

const Home: FC<Props> = () => {
  const allCredentails: CredentialsHash = useAppSelector(state => state.main.allCredentails)
  const [modalOpen, setModal] = useState<boolean>(true);
  const [searchString, setSearchString] = useState<string>('');

  useEffect(() => {
    if (Object.keys(allCredentails).length === 0) {
      setModal(true);
    } else {
      setModal(false);
    }
  }, [allCredentails]);

  return (
    <div className="h-full">
      {modalOpen && <PasswordModal />}
      <div className="border-2 flex justify-center bg-gray-200 sticky top-16">
        <input
          type="text"
          name="name"
          placeholder="Search..."
          className="m-2 p-2 w-11/12 rounded-full italic focus:outline-none ring-2 focus:ring-red-500"
          onChange={(event) => setSearchString(event.target.value)}
          value={searchString}
        />
      </div>
      {<ul>
        {
          Object.values(allCredentails)
            .filter(cred => {
              const searchStr = searchString.toLowerCase()
              return cred?.name?.toLowerCase()?.includes(searchStr) ||
                cred?.username?.toLowerCase()?.includes(searchStr) ||
                cred?.url?.toLowerCase()?.includes(searchStr);
            })
            .map(({ id, name }) =>
              <CredentialItem
                key={id}
                data={{ ...allCredentails[id], id, name }}
              />)
        }
      </ul>
      }
      <RiAddCircleFill className="fixed bottom-6 right-3 text-6xl text-red-600 z-10" />
    </div>
  );
};

export default Home;
