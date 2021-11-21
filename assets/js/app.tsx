import React, { useEffect } from 'react';
import { Route, Switch } from 'react-router-dom';
import Layout from './src/components/Layout/Layout';
import ProtectedRoute from './ProtectedRoute';
import SignIn from './src/components/SignIn/SignIn';
import Home from './src/components/Home/Home';
import { usePersistedState } from './src/hooks/usePersistedState';
import useAppDispatch from './src/hooks/useAppDispatch';
import { SIGN_IN } from './src/constants/actionTypes';

const LpassApp = () => {
  const dispatch = useAppDispatch();
  const [token, _setToken] = usePersistedState<string | undefined>('token', undefined);

  // On App load find and load token in store
  useEffect(() => {
    // Save token in store
    if(token) {
      dispatch({
        type: SIGN_IN,
        payload: token
      });
    }
  }, [token]);

  return (
    <Layout>
      <Switch>
        <Route exact path="/sign_in" component={SignIn} />
        <ProtectedRoute exact path="/" component={Home} />
      </Switch>
    </Layout>);
};

export default LpassApp;
