import React, { FC, useState, useEffect, SyntheticEvent } from 'react';
import useAppDispatch from '../../hooks/useAppDispatch';
import { useHistory } from "react-router-dom";
import { MdSecurity } from 'react-icons/md';
import { signIn } from '../../actions/index';
import usePersistedState from '../../hooks/usePersistedState';
import Loader from '../Loader/Loader';
import useAppSelector from '../../hooks/useAppSelector';
import { USERNAME } from 'env';

interface Props {
  // any props that come into the component
}

const SignIn: FC<Props> = () => {
  const dispatch = useAppDispatch();
  const history = useHistory();
  const signInUser = signIn(dispatch);
  const online = useAppSelector((state) => state.main.online);

  const [lpassUsername, changeLpassUsername] = useState<string>('');
  const [serverPassword, changeServerPassword] = useState<string>('');
  const [lpassPassword, changeLpassPassword] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  // Custom hook to fetch and save auth token to indexDB
  const [token, setToken] = usePersistedState<string | undefined>('token', undefined);

  // Disable submit button until all fields have some value
  const valid = lpassUsername.length && lpassPassword.length && serverPassword.length;

  // Once the token is available navigate to home
  useEffect(() => {
    if (token) {
      history.push('/');
    }
  }, [token]);

  const onSubmit = async (event: SyntheticEvent) => {
    event.preventDefault();
    setLoading(true);
    signInUser(lpassUsername, serverPassword, lpassPassword, setToken)
      .finally(() => setLoading(false))
  }

  const userName = USERNAME || 'LastPass User';

  return (
    <div className="flex flex-col items-center dark:bg-gray-400">
      <div className="mt-16">
        <MdSecurity className="text-6xl text-red-600" />
      </div>
      <div className="text-xl mt-2"> {`👋 Hey ${userName}! Sign In here`} </div>

      <form
        className="flex flex-col items-center text-lg"
        onSubmit={onSubmit}
      >
        <section>
          <input
            className="p-1 pl-2 rounded-full italic mt-4 mb-4
            w-64 focus:outline-none ring-2 focus:ring-red-500"
            type="text"
            name="lpassUsername"
            placeholder="Lastpass username"
            onChange={(e) => changeLpassUsername(e.target.value)}
            value={lpassUsername}
          />
        </section>
        <section>
          <input
            className="p-1 pl-2 rounded-full italic mt-4 mb-4
            w-64 focus:outline-none ring-2 focus:ring-red-500"
            type="password"
            name="serverPassword"
            placeholder="Server password"
            onChange={(e) => changeServerPassword(e.target.value)}
            value={serverPassword}
          />
        </section>
        <section>
          <input
            className="p-1 pl-2 rounded-full italic mt-4 mb-4
            w-64 focus:outline-none ring-2 focus:ring-red-500"
            type="password"
            name="lpassPassword"
            placeholder="Lastpass password"
            onChange={(e) => changeLpassPassword(e.target.value)}
            value={lpassPassword}
          />
        </section>
        {online
          ? <section>
            {loading ?
              <div>
                <div className="text-sm font-semibold font-mono italic text-red-600 text-center">
                  Accept any MFA notifications
                </div>
                <div className="text-sm font-semibold font-mono italic text-red-600 text-center">
                  if you have MFA enabled
                </div>
                <Loader />
              </div>
              : <input
                type="submit"
                value="Sign In"
                className={`p-2 italic bg-red-600 text-white rounded-xl m-3 mb-8
              font-semibold ${!valid && 'opacity-50 cursor-not-allowed'}`
                }
                disabled={!valid} />
            }
          </section>
          : <span className="mt-2 text-red-500 font-semibold"> You are offline! Go online to sign in. </span>
        }

      </form>
    </div>
  );
};

export default SignIn;
