import React, { FC, useState, SyntheticEvent } from 'react';
import { useRouteMatch, useHistory, match } from 'react-router-dom';
import PasswordStrengthBar from 'react-password-strength-bar';
import { BsFillEyeFill, BsFillEyeSlashFill } from 'react-icons/bs';
import { ImBin } from 'react-icons/im';
import { IoMdArrowRoundBack } from 'react-icons/io';
import { saveCredential, deleteCredential } from '../../actions/index';
import useAppDispatch from '../../hooks/useAppDispatch';
import useAppSelector from '../../hooks/useAppSelector';

import Loader from '../Loader/Loader';

interface Props { }

interface MatchParams {
  id: string;
}

const CredentialForm: FC<Props> = () => {
  const dispatch = useAppDispatch();
  const history = useHistory();
  const [online, allCredential, groups] = useAppSelector(state => [state.main.online, state.main.allCredentials, state.main.groups]);
  const urlParams: match<MatchParams> = useRouteMatch<MatchParams>();
  const mode = urlParams.params.id ? 'UPDATE' : 'CREATE';
  const credential = allCredential[urlParams.params.id];
  const [name, changeName] = useState<string>(credential?.name || '');
  const [group, changeGroup] = useState<string>(credential?.group || '');
  const [url, changeUrl] = useState<string>(credential?.url || '');
  const [username, changeUsername] = useState<string>(credential?.username || '');
  const [password, changePassword] = useState<string>(credential?.password || '');
  const [passwordVisible, toggleShowPassword] = useState<boolean>(false);
  const [notes, changeNote] = useState<string>(credential?.note || '');
  const [loading, setLoading] = useState<boolean>(false);
  const dispatchSaveCredential = saveCredential(dispatch, mode);
  const deleteCredentialData = deleteCredential(dispatch);

  // TODO: Attempt to fetch id from server when dummy id
  const isDummyId = urlParams.params.id && (urlParams.params.id.startsWith('dummy-') || urlParams.params.id == '0');

  // Disable submit button until all fields have some value
  const valid = name.length;

  const onSubmit = async (event: SyntheticEvent) => {
    event.preventDefault();
    setLoading(true);
    dispatchSaveCredential({ id: urlParams.params.id, name, group, url, username, password, notes })
      .finally(() => {
        setLoading(false);
        history.push("/");
      })
  }

  const onDelete = async (event: SyntheticEvent) => {
    event.preventDefault();
    if (!confirm('Are you sure you want to delete this credential?')) {
      return;
    }

    setLoading(true);
    deleteCredentialData(urlParams.params.id)
      .finally(() => {
        setLoading(false);
        history.push("/");
      });
  };

  const passwordToggleIconProps = {
    className: "inline-block text-3xl absolute mt-8 cursor-pointer",
    style: { right: '5%' },
    onClick: () => toggleShowPassword((currState) => !currState)
  };

  return (
    <div className="dark:bg-gray-400">
      <div className='h-12 top-16 sticky z-50 bg-white dark:bg-gray-400'>
        <IoMdArrowRoundBack
          className="text-3xl rounded-full bg-white dark:bg-black dark:text-white m-2 fixed"
          onClick={() => history.push('/')}
        />
      </div>

      <form
        className="flex flex-col items-center text-lg"
        onSubmit={onSubmit}
      >
        <section className="w-11/12">
          <label className="font-semibold text-red-500"> Name: </label>
          <input className="focus:outline-none focus:border-pink-800 border-b-2 border-black w-full p-2 pt-0"
            type="text"
            name="name"
            onChange={(e) => changeName(e.target.value)}
            value={name}
          />
        </section>

        <section className="w-11/12 mt-4">
          <label className="font-semibold text-red-500"> Group/Folder: </label>
          <input className="focus:outline-none focus:border-pink-800 border-b-2 border-black w-full p-2 pt-0"
            type="text"
            name="group"
            onChange={(e) => changeGroup(e.target.value)}
            value={group}
            list="groupInput"
          />
          <datalist id="groupInput">
            {groups.map((({ id, group }) => <option value={group} key={id} />))}
          </datalist>
        </section>

        <section className="w-11/12 mt-4">
          <label className="font-semibold text-red-500"> URL: </label>
          <input className="focus:outline-none focus:border-pink-800 border-b-2 border-black w-full p-2 pt-0"
            type="text"
            name="url"
            onChange={(e) => changeUrl(e.target.value)}
            value={url}
          />
        </section>

        <section className="w-11/12 mt-4">
          <label className="font-semibold text-red-500"> Username: </label>
          <input className="focus:outline-none focus:border-pink-800 border-b-2 border-black w-full p-2 pt-0"
            type="text"
            name="username"
            onChange={(e) => changeUsername(e.target.value)}
            value={username}
          />
        </section>

        <section className="w-11/12 mt-4">
          <div className="w-full inline-block">
            <label className="font-semibold text-red-500"> Password: </label>
            <input className="focus:outline-none focus:border-pink-800 border-b-2 border-black w-full p-2 pt-0"
              type={passwordVisible ? 'text' : 'password'}
              name="url"
              onChange={(e) => changePassword(e.target.value)}
              value={password}
            />
            <PasswordStrengthBar password={password} className='m' />
          </div>
          {
            passwordVisible
              ? <BsFillEyeSlashFill {...passwordToggleIconProps} />
              : <BsFillEyeFill {...passwordToggleIconProps} />
          }

        </section>

        <section className="w-11/12">
          <label className="font-semibold text-red-500"> Note: </label>
          <textarea className="mt-4 ring-2 rounded-md focus:outline-none focus:ring-pink-800 ring-black w-full p-2 pt-0"
            name="note"
            onChange={(e) => changeNote(e.target.value)}
            value={notes}
            rows={3}
          />
        </section>

        {online && <section className="flex">
          {loading
            ? <Loader />
            : <>
              {mode === "UPDATE" && <ImBin className="text-3xl text-red-500 mt-4 mr-6 cursor-pointer" onClick={onDelete} />}
              {isDummyId ? <div className='mt-4 font-semibold italic'> Sync with server to update </div> : <input
                type="submit"
                value={mode === "CREATE" ? "Save" : "Update"}
                className={`p-2 italic cursor-pointer bg-red-600 text-white rounded-xl mt-3 mb-8 font-semibold ${!valid && 'opacity-50 cursor-not-allowed'}`}
                disabled={!valid} />
              }
            </>
          }
        </section>}
      </form>
    </div>
  );
};

export default CredentialForm;
