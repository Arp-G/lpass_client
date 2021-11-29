import React, { useEffect } from 'react';
import { batchActions } from 'redux-batched-actions';
import { Route, Switch } from 'react-router-dom';
import Layout from './src/components/Layout/Layout';
import ProtectedRoute from './ProtectedRoute';
import SignIn from './src/components/SignIn/SignIn';
import Home from './src/components/Home/Home';
import { getMany } from "idb-keyval";
import useAppDispatch from './src/hooks/useAppDispatch';
import { SYNC_ALL_CREDENTIALS, SIGN_IN } from './src/constants/actionTypes';
import useAppSelector from './src/hooks/useAppSelector';
import CredentailForm from './src/components/CredentailForm/CredentialForm';

const LpassApp = () => {
  const dispatch = useAppDispatch();

  // Serves as a check, used to display loading until persisted state is loaded into store.
  const tokenLoaded = useAppSelector(state => state.main.token);

  // On App load find and load persisted state in store
  useEffect(() => {
    getMany(['token', 'allCredentials'])
      .then(([token, allCredentials]) => {
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
      })
  }, []);

  if (tokenLoaded === undefined)
    return <div>Loading...</div>

  return (
    <Layout>
      <Switch>
        <Route exact path="/sign_in" component={SignIn} />
        <ProtectedRoute exact path="/" component={Home} />
        <ProtectedRoute exact path="/credentials/:id" component={CredentailForm} />
      </Switch>
    </Layout>);
};

export default LpassApp;
