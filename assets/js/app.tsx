import React from 'react';
import { Route, Switch } from 'react-router-dom';
import Layout from './src/components/Layout/Layout';
import SignIn from './src/components/SignIn/SignIn';
import Home from './src/components/Home/Home';

const LpassApp = () => {
  return (
    <Layout>
      <Switch>
        <Route exact path="/" component={SignIn} />
        <Route exact path="/home" component={Home} />
        {/* <ProtectedRoute exact path="/lobby/:game_id" component={Lobby} /> */}
      </Switch>
    </Layout>);
};

export default LpassApp;
