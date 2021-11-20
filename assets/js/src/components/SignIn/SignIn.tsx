import React, { FC, useState, useEffect, SyntheticEvent } from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from "react-router-dom";
import { MdSecurity } from 'react-icons/md';
import { usePersistedState } from '../../hooks/usePersistedState';
import Api from '../../api/api';
import { SIGN_IN } from '../../constants/actionTypes';

interface Props {
  // any props that come into the component
}

const SignIn: FC<Props> = () => {
  const dispatch = useDispatch();
  const history = useHistory();

  const [lpassUsername, changeLpassUsername] = useState<string>('');
  const [serverPassword, changeServerPassword] = useState<string>('');
  const [lpassPassword, changeLpassPassword] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);

  // Custom hook to fetch and save auth token to indexDB
  const [token, setToken] = usePersistedState<string | undefined>('token', undefined);

  // Disable submit button untill all fields have some value
  const valid = lpassUsername.length && lpassPassword.length && serverPassword.length;

  // Once the token is available navigate to home
  useEffect(() => {
    if (token) history.push('/home');
  }, [token]);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    if (error) {
      timer = setTimeout(() => setError(false), 5000);
    }

    return () => clearTimeout(timer);
  }, [error]);

  const onSubmit = async (event: SyntheticEvent) => {
    event.preventDefault();
    try {
      setLoading(true);
      const response = await Api.post('/sign_in', { lpassUsername, serverPassword, lpassPassword });

      // Save token in store
      dispatch({
        type: SIGN_IN,
        payload: response.data.token
      });

      // Persist token in indexDB
      setToken(response.data);
    } catch (err) {
      console.log(err);
      setError(true);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex border-2 w-screen h-screen flex-col items-center">
      <div className="mt-16">
        <MdSecurity className="text-6xl text-red-600" />
      </div>
      <div className="text-xl mt-2"> 👋 Hey Arpan! Sign In here </div>

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
        <section>
          {loading ?
            <div className="flex mt-2 items-center justify-center space-x-2 animate-bounce">
              <div className="w-2 h-2 bg-red-600 rounded-full"></div>
              <div className="w-2 h-2 bg-green-600 rounded-full"></div>
              <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
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
      </form>
      <div
        className={`my-3 text-sm text-left text-white bg-yellow-500 h-12 flex items-center
         mt-24 p-4 rounded-md transition-opacity duration-500  ${error ? 'opacity-100' : 'opacity-0'}`}
        role="alert"
      >
        Incorrect credentails, please try again!
      </div>
    </div>
  );
};

export default SignIn;
