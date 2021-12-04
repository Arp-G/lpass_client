import React, { useEffect } from 'react';
import { batchActions } from 'redux-batched-actions';
import { Route, Switch } from 'react-router-dom';
import Api from './src/api/api';
import Layout from './src/components/Layout/Layout';
import ProtectedRoute from './ProtectedRoute';
import SignIn from './src/components/SignIn/SignIn';
import Home from './src/components/Home/Home';
import { getMany, delMany } from "idb-keyval";
import useAppDispatch from './src/hooks/useAppDispatch';
import { SYNC_ALL_CREDENTIALS, SIGN_IN, SIGN_OUT } from './src/constants/actionTypes';
import useAppSelector from './src/hooks/useAppSelector';
import CredentailForm from './src/components/CredentailForm/CredentialForm';




/*
TODO:

Move all dispatch calls to be done via actions.
Define actions in separate actions/index.js file
Define action using "redux-actions"
Make actions for making api calls and dispatching
batch actions whenever possible

For all authenticated API calls make sure to redirect to sign in
in case of forbidden response.

ref: https://redux.js.org/usage/reducing-boilerplate#actions
*/

const LpassApp = () => {
  const dispatch = useAppDispatch();

  // Serves as a check, used to display loading until persisted state is loaded into store.
  const tokenLoaded = useAppSelector(state => state.main.token);
  const signOut = () => delMany(['token', 'allCredentials']).then(() => dispatch({ type: SIGN_OUT }));

  // On App load find and load persisted state in store
  useEffect(() => {
    getMany(['token', 'allCredentials'])
      .then(([token, allCredentials]) => {
        Api.get('/login_status')
          .then(response => {
            if (!response?.data?.logged_in) {
              signOut();
              return;
            }

            const actions = [];

            actions.push({
              type: SIGN_IN,
              payload: token || null
            })

            if (allCredentials)
              actions.push({
                type: SYNC_ALL_CREDENTIALS,
                payload: allCredentials
              })

            if (actions.length > 0) dispatch(batchActions(actions));
          }).catch(() => {
            signOut();
          });
      })
  }, []);

  if (tokenLoaded === undefined)
    return <div>Loading...</div>

  return (
    <Layout>
      <Switch>
        <Route exact path="/sign_in" component={SignIn} />
        <ProtectedRoute exact path="/" component={Home} />
        <ProtectedRoute exact path="/credentials" component={CredentailForm} />
        <ProtectedRoute exact path="/credentials/:id" component={CredentailForm} />
      </Switch>
    </Layout>);
};

export default LpassApp;
