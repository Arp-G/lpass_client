import { Action } from "redux";
import { SIGN_IN, SIGN_OUT, SET_ALERT, CLEAR_ALERT } from '../constants/actionTypes';
import { ALERT } from '../Types/Types';

export interface MainState {
  token?: string,
  alert?: ALERT
}

interface ActionWithPayload<T> extends Action {
  payload: T;
}

const initialState: MainState = { token: undefined, alert: undefined };

const mainReducer = (state = initialState, action: ActionWithPayload<any>) => {
  switch (action.type) {

    case SIGN_IN:
      return { ...state, token: action.payload };

    case SIGN_OUT:
      return { ...state, token: undefined };

    case SET_ALERT:
      return { ...state, alert: action.payload };

    case CLEAR_ALERT:
      return { ...state, alert: undefined };

    default:
      return state;
  }
};

export default mainReducer;
