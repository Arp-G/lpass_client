import React, { FC } from 'react';
import { Credential } from '../../Types/Types';
import { RiLockPasswordFill } from 'react-icons/ri';

interface Props {
  data: Credential
}

const CredentailItem: FC<Props> = ({ data }) => {
  return (
    <li key={data.id} className="flex m-4 pb-2 space-x-6 border-b-2">
      <div>
        {
          data.favicon
            ? <img className="inline w-8 h-8 mt-3" src={`data:image/png;base64,${data.favicon}`} />
            : <RiLockPasswordFill className="inline w-8 h-8 text-red-600" />
        }
      </div>
      <div>
        <div className={`font-mono font-semibold text-md`}>{data.name}</div>
        {data.username && <div className="font-medium text-gray-400">{data.username}</div>}
      </div>
      <hr />
    </li>);
}

export default CredentailItem;
