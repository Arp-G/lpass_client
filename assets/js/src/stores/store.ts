import { createStore, applyMiddleware, compose } from 'redux';
import logger from 'redux-logger';
import { routerMiddleware } from 'connected-react-router';
import { createBrowserHistory } from 'history';
import createRootReducer from '../reducers/reducers';

export const history = createBrowserHistory();
const devMode = process.env.NODE_ENV === 'development';
const middlewares = [routerMiddleware(history)];

if (devMode) middlewares.push(logger);

const rootReducer = createRootReducer(history);
export const store = createStore(rootReducer, compose(applyMiddleware(...middlewares)));

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {main: MainState}
export type AppDispatch = typeof store.dispatch
