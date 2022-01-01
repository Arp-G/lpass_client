import React, { useEffect } from 'react';
import { Route, Switch } from 'react-router-dom';
import { set, getMany } from 'idb-keyval';
import { setConnectivityStatus, checkLoginStatusAndInitLocalState } from './src/actions/index';
import useAppDispatch from './src/hooks/useAppDispatch';
import useAppSelector from './src/hooks/useAppSelector';
import usePrevious from './src/hooks/usePrevious';
import { CredentialsHash } from './src/Types/Types';
import ProtectedRoute from './ProtectedRoute';
import registerConnectivityListeners from './src/api/connectivity';
import Layout from './src/components/Layout/Layout';
import SignIn from './src/components/SignIn/SignIn';
import Home from './src/components/Home/Home';
import SplashScreen from './src/components/SplashScreen/SplashScreen';
import CredentialForm from './src/components/CredentailForm/CredentialForm';

const LpassApp = () => {
  const dispatch = useAppDispatch();
  const dispatchLoadState = checkLoginStatusAndInitLocalState(dispatch);
  const dispatchConnectivityState = setConnectivityStatus(dispatch);

  // Serves as a check, used to display loading until persisted state is loaded into store.
  const [tokenLoaded, allCredentials, darkMode, allowOffline] = useAppSelector(state => [
    state.main.token, state.main.allCredentials, state.main.darkMode, state.main.allowOffline]);

  // On App load
  // Set connectivity status
  // find and load persisted state in store
  useEffect(() => {
    registerConnectivityListeners(dispatchConnectivityState);
    getMany(['token', 'allCredentials', 'darkMode'])
      .then(([token, credentials, darkMode]) => dispatchLoadState(token || null, credentials, darkMode))
  }, []);

  // Every 10 second poll to update connectivity status
  // useEffect(() => {
  //   const timer = setInterval(() => handleConnection(dispatchConnectivityState), 10000);
  //   return () => clearInterval(timer);
  // }, []);

  const previousAllCredentials = usePrevious<CredentialsHash>(allCredentials);
  const previousDarkMode = usePrevious<boolean | undefined>(darkMode);

  // When credentials list changes persist new changes to indexDB
  useEffect(() => {
    // Prevent unneeded indexDB update when loading state initially
    if (
      previousAllCredentials &&
      Object.keys(previousAllCredentials).length !== 0 &&
      Object.keys(allCredentials).length > 0
    ) {
      if (allowOffline)
        set('allCredentials', Object.values(allCredentials))
    }
  }, [allCredentials, allowOffline]);

  // When dark mode preference changes persist new change to indexDB
  useEffect(() => {
    // When dark mode setting loaded from index db or initial state
    // then avoid persisting in index db.
    if (previousDarkMode === undefined || darkMode === undefined) return;
    set('darkMode', darkMode);
  }, [darkMode]);

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
