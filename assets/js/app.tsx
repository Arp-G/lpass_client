import React from 'react';
import { Route, Switch } from 'react-router-dom';
import Layout from './src/components/Layout/Layout';
import SignIn from './src/components/SignIn/SignIn';

const LpassApp = () => {
  return (
    <Layout>
      <Switch>
        <Route exact path="/" component={SignIn} />
        {/* <ProtectedRoute exact path="/lobby/:game_id" component={Lobby} />
      <ProtectedRoute exact path="/game/:game_id" component={Game} />
      <ProtectedRoute exact path="/play" component={GamesList} />
      <Route path="*" exact={true} component={NotFound} /> */}
      </Switch>
    </Layout>);
};

export default LpassApp;
