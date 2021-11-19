import { createStore, applyMiddleware, compose } from 'redux';
import logger from 'redux-logger';
import { routerMiddleware } from 'connected-react-router';
import { createBrowserHistory } from 'history';
import createRootReducer from '../reducers/reducers';

export const history = createBrowserHistory();
const devMode = process.env.NODE_ENV === 'development';
const middlewares = [routerMiddleware(history)];

if (devMode) middlewares.push(logger);

export default () => {
  const store = createStore(createRootReducer(history), compose(applyMiddleware(...middlewares)));
  return store;
};
