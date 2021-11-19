import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';
import { History } from 'history';
import main from './main';

const createRootReducer = (history: History) => combineReducers({
  router: connectRouter(history),
  main
});

export default createRootReducer;
