import React, { FC, useState, SyntheticEvent } from 'react';
import { useRouteMatch, match } from 'react-router-dom';
import PasswordStrengthBar from 'react-password-strength-bar';
import { BsFillEyeFill, BsFillEyeSlashFill } from 'react-icons/bs';
import { ImBin } from 'react-icons/im';
import { batchActions } from 'redux-batched-actions';
import useAppDispatch from '../../hooks/useAppDispatch';
import useAppSelector from '../../hooks/useAppSelector';
import { useHistory } from "react-router-dom";
import { MdSecurity } from 'react-icons/md';
import { usePersistedState } from '../../hooks/usePersistedState';
import Loader from '../Loader/Loader';
import Api from '../../api/api';
import { Credential } from '../../Types/Types';
import { SYNC_ALL_CREDENTIALS, DELETE_CREDENTIAL, SET_ALERT } from '../../constants/actionTypes';

interface Props {
}

interface MatchParams {
  id: string;
}

const CredentailForm: FC<Props> = () => {
  const dispatch = useAppDispatch();
  const history = useHistory();
  const allCredentail = useAppSelector(state => state.main.allCredentials);
  const urlParams: match<MatchParams> = useRouteMatch<MatchParams>();
  const mode = urlParams.params.id ? 'edit' : 'new';

  const credential = allCredentail[urlParams.params.id];
  const [name, changeName] = useState<string>(credential?.name || '');
  const [url, changeUrl] = useState<string>(credential?.url || '');
  const [username, changeUsername] = useState<string>(credential?.username || '');
  const [password, changePassword] = useState<string>(credential?.password || '');
  const [passwordVisible, toggleShowPassword] = useState<boolean>(false);
  const [note, changeNote] = useState<string>(credential?.note || '');
  const [loading, setLoading] = useState<boolean>(false);

  // Disable submit button untill all fields have some value
  const valid = name.length;

  const onSubmit = async (event: SyntheticEvent) => {
    event.preventDefault();
    setLoading(true);
    if (mode === 'new') {
      Api.post('/credentials', { name, url, username, password, note })
        .then(_response => {

          // Update in local state
          dispatch(batchActions([
            {
              type: SET_ALERT,
              payload: { message: 'Saved!', type: 'SUCCESS' }
            }]));
        }).catch(err => {
          console.log(err);
          dispatch({
            type: SET_ALERT,
            payload: { message: 'Failed, try again!', type: 'ERROR' }
          })
        }).finally(() => setLoading(false));
    } else {
      Api.patch(`/credentials/${urlParams.params.id}`, { name, url, username, password, note })
        .then(_response => {

          // Update in local state
          dispatch(batchActions([
            {
              type: SET_ALERT,
              payload: { message: 'Updated!', type: 'SUCCESS' }
            }]));
        }).catch(err => {
          console.log(err);
          dispatch({
            type: SET_ALERT,
            payload: { message: 'Failed, try again!', type: 'ERROR' }
          })
        }).finally(() => setLoading(false));
    }
  }

  const onDelete = async (event: SyntheticEvent) => {
    event.preventDefault();
    if (!confirm('Are you sure you want to delete this credentail?')) {
      return;
    }

    setLoading(true);

    Api.delete(`/credentials/${urlParams.params.id}`)
      .then(_response => {
        // Update in local state
        dispatch(batchActions([
          {
            type: DELETE_CREDENTIAL,
            payload: urlParams.params.id
          },
          {
            type: SET_ALERT,
            payload: { message: 'Deleted!', type: 'SUCCESS' }
          }]));
      }).catch(err => {
        console.log(err);
        dispatch({
          type: SET_ALERT,
          payload: { message: 'Failed, try again!', type: 'ERROR' }
        })
      }).finally(() => {
        setLoading(false);
        history.push("/");
      });
  }

  const passwordToggleIconProps = {
    className: "inline-block text-3xl absolute mt-8 cursor-pointer",
    style: { right: '5%' },
    onClick: () => toggleShowPassword((currState) => !currState)
  };

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
          <div className="w-full inline-block">
            <label className="font-semibold text-red-500"> Password: </label>
            <input className="focus:outline-none focus:border-pink-800 border-b-2 border-black w-full p-2 pt-0"
              type={passwordVisible ? 'text' : 'password'}
              name="url"
              onChange={(e) => changePassword(e.target.value)}
              value={password}
            />
            <PasswordStrengthBar password={password} />
          </div>
          {
            passwordVisible
              ? <BsFillEyeSlashFill {...passwordToggleIconProps} />
              : <BsFillEyeFill {...passwordToggleIconProps} />
          }

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

        <section className="flex">
          {loading
            ? <Loader />
            : <>
              {mode === "edit" && <ImBin className="text-3xl text-red-500 mt-4 mr-6 cursor-pointer" onClick={onDelete} />}
              <input
                type="submit"
                value={mode === "new" ? "Save" : "Update"}
                className={`p-2 italic cursor-pointer bg-red-600 text-white rounded-xl mt-3 mb-8 font-semibold ${!valid && 'opacity-50 cursor-not-allowed'}`}
                disabled={!valid} />
            </>
          }
        </section>
      </form>
    </div>
  );
};

export default CredentailForm;
