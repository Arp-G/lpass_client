import React, { FC } from 'react';
import { Credential } from '../../Types/Types';
import { RiLockPasswordFill } from 'react-icons/ri';
import { useHistory } from 'react-router';

interface Props {
  data: Credential
}

const CredentialItem: FC<Props> = ({ data }) => {
  const history = useHistory();

  return (
    <li
      key={data.id}
      className="flex mt-4 pb-2 space-x-6 border-b-2 cursor-pointer"
      onClick={() => history.push(`/credentials/${data.id}`)}
    >
      <div>
        {
          data.favicon
            ? <img className="inline w-8 h-8 mt-3" src={`data:image/png;base64,${data.favicon}`} />
            : <RiLockPasswordFill className="inline w-8 h-8 text-red-600" />
        }
      </div>
      <div>
        <div className={`font-mono font-semibold text-md dark:text-white`}>{data.name}</div>
        {data.username && <div className="font-medium text-gray-400 dark:text-gray-300">{data.username}</div>}
      </div>
      <hr />
    </li>);
}

export default CredentialItem;
