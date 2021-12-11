import React, { useEffect } from 'react';
import { Route, Switch } from 'react-router-dom';
import { set, getMany } from 'idb-keyval';
import { checkLoginStatusAndInitLocalState } from './src/actions/index';
import useAppDispatch from './src/hooks/useAppDispatch';
import useAppSelector from './src/hooks/useAppSelector';
import usePrevious from './src/hooks/usePrevious';
import { CredentialsHash } from './src/Types/Types';
import ProtectedRoute from './ProtectedRoute';
import Layout from './src/components/Layout/Layout';
import SignIn from './src/components/SignIn/SignIn';
import Home from './src/components/Home/Home';
import SplashScreen from './src/components/SplashScreen/SplashScreen';
import CredentialForm from './src/components/CredentailForm/CredentialForm';

/*
TODO:

look into note not saving/updating issue
look into scroll bar issues
Dark mode
Offile mode
PWA
*/

const LpassApp = () => {
  const dispatch = useAppDispatch();
  const loadState = checkLoginStatusAndInitLocalState(dispatch);

  // Serves as a check, used to display loading until persisted state is loaded into store.
  const [tokenLoaded, allCredentials] = useAppSelector(state => [state.main.token, state.main.allCredentials]);

  // On App load find and load persisted state in store
  useEffect(() => {
    getMany(['token', 'allCredentials'])
      .then(([token, credentails]) => loadState(token || null, credentails))
  }, []);

  const previousAllCredentials = usePrevious<CredentialsHash>(allCredentials);

  useEffect(() => {
    // Prevent uneeded indexDB update when loading state initially
    if (
      previousAllCredentials &&
      Object.keys(previousAllCredentials).length !== 0 &&
      Object.keys(allCredentials).length > 0
    ) {
      set('allCredentials', Object.values(allCredentials))
    }
  }, [allCredentials]);

  if (tokenLoaded === undefined)
    return <SplashScreen />;

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
