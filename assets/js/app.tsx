import React, { useEffect } from 'react';
import { batchActions } from 'redux-batched-actions';
import { Route, Switch } from 'react-router-dom';
import { set } from 'idb-keyval';
import Api from './src/api/api';
import Layout from './src/components/Layout/Layout';
import ProtectedRoute from './ProtectedRoute';
import SignIn from './src/components/SignIn/SignIn';
import Home from './src/components/Home/Home';
import { getMany, delMany } from "idb-keyval";
import useAppDispatch from './src/hooks/useAppDispatch';
import { SAVE_ALL_CREDENTIALS, SIGN_IN, SIGN_OUT } from './src/constants/actionTypes';
import useAppSelector from './src/hooks/useAppSelector';
import CredentialForm from './src/components/CredentailForm/CredentialForm';

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


fix react state update on unmounted component bug
do attemp to fetch dummy id
fix some times sorter wont work
ui bug when opening pass modal on show page
store sync password and auto sync without password repromt on susequent try
look into note not saving/updating issue
redirect to home after save/update/delete operations
*/

const LpassApp = () => {
  const dispatch = useAppDispatch();

  // Serves as a check, used to display loading until persisted state is loaded into store.
  const [tokenLoaded, allCredentials] = useAppSelector(state => [state.main.token, state.main.allCredentials]);
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
                type: SAVE_ALL_CREDENTIALS,
                payload: allCredentials
              })

            if (actions.length > 0) dispatch(batchActions(actions));
          }).catch(() => {
            signOut();
          });
      })
  }, []);

  // Whenever credentails changes in store update indexdb with updated credential list
  // TODO: Find a way to avoid uneeded index db update on load
  useEffect(() => {
    if (Object.values(allCredentials).length > 0) set('allCredentials', Object.values(allCredentials))
  }, [allCredentials])

  if (tokenLoaded === undefined)
    return <div>Loading...</div>

  return (
    <Layout>
      <Switch>
        <Route exact path="/sign_in" component={SignIn} />
        <ProtectedRoute exact path="/" component={Home} />
        <ProtectedRoute exact path="/credentials" component={CredentialForm} />
        <ProtectedRoute exact path="/credentials/:id" component={CredentialForm} />
      </Switch>
    </Layout>);
};

export default LpassApp;
