import React, { FC, useState, SyntheticEvent } from 'react';
import { useRouteMatch } from 'react-router-dom';
import { batchActions } from 'redux-batched-actions';
import useAppDispatch from '../../hooks/useAppDispatch';
import useAppSelector from '../../hooks/useAppSelector';
import { useHistory } from "react-router-dom";
import { MdSecurity } from 'react-icons/md';
import { usePersistedState } from '../../hooks/usePersistedState';
import Loader from '../Loader/Loader';
import Api from '../../api/api';
import { Credential } from '../../Types/Types';
import { SET_ALERT, SIGN_IN } from '../../constants/actionTypes';


interface Props {
  mode: 'new' | 'edit' | 'show'
}

interface MatchParams {
  id: string;
}

const CredentailForm: FC<Props> = ({ match: { params } }: MatchParams) => {
  const allCredentail = useAppSelector(state => state.main.allCredentials);
  const urlParams = useRouteMatch<MatchParams>('/credentials/:id');
  const credential = allCredentail[urlParams?.params?.id];

  console.log(match);

  const [name, changeName] = useState<string>(credential?.name || '');
  const [url, changeUrl] = useState<string>(credential?.url || '');
  const [username, changeUsername] = useState<string>(credential?.username || '');
  const [password, changePassword] = useState<string>(credential?.password || '');
  const [note, changeNote] = useState<string>(credential?.note || '');
  const [loading, setLoading] = useState<boolean>(false);

  // Disable submit button untill all fields have some value
  const valid = name.length;

  const onSubmit = async (event: SyntheticEvent) => {
    event.preventDefault();
  }

  return (
    <div className="w-screen">
      <form
        className="flex flex-col items-center text-lg"
        onSubmit={onSubmit}
      >
        <section className="w-11/12 mt-6">
          <label className="font-semibold text-red-500"> Name: </label>
          <input className="focus:outline-none focus:border-pink-800 border-b-2 border-black w-full p-2 pt-0"
            type="text"
            name="name"
            onChange={(e) => changeName(e.target.value)}
            value={name}
          />
        </section>

        <section className="w-11/12 mt-6">
          <label className="font-semibold text-red-500"> URL: </label>
          <input className="focus:outline-none focus:border-pink-800 border-b-2 border-black w-full p-2 pt-0"
            type="text"
            name="url"
            onChange={(e) => changeUrl(e.target.value)}
            value={url}
          />
        </section>

        <section className="w-11/12 mt-6">
          <label className="font-semibold text-red-500"> Username: </label>
          <input className="focus:outline-none focus:border-pink-800 border-b-2 border-black w-full p-2 pt-0"
            type="text"
            name="username"
            onChange={(e) => changeUsername(e.target.value)}
            value={username}
          />
        </section>

        <section className="w-11/12 mt-6">
          <label className="font-semibold text-red-500"> Password: </label>
          <input className="focus:outline-none focus:border-pink-800 border-b-2 border-black w-full p-2 pt-0"
            type="password"
            name="url"
            onChange={(e) => changePassword(e.target.value)}
            value={password}
          />
        </section>

        <section className="w-11/12 mt-6">
          <label className="font-semibold text-red-500"> Note: </label>
          <textarea className="mt-4 ring-2 rounded-md focus:outline-none focus:ring-pink-800 ring-black w-full p-2 pt-0"
            name="note"
            onChange={(e) => changeNote(e.target.value)}
            value={note}
            rows={3}
          />
        </section>

        <section>
          {loading ?
            <div>
              <Loader />
            </div>
            : <input
              type="submit"
              value="Save"
              className={`p-2 italic bg-red-600 text-white rounded-xl m-3 mb-8 w-16
              font-semibold ${!valid && 'opacity-50 cursor-not-allowed'}`
              }
              disabled={!valid} />
          }
        </section>
      </form>
    </div>
  );
};

export default CredentailForm;
