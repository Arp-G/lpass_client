import { Action } from "redux";
import { SIGN_IN, SIGN_OUT, SYNC_ALL_CREDENTIALS, SET_ALERT, CLEAR_ALERT } from '../constants/actionTypes';
import { CredentialsHash, Credential, Alert } from '../Types/Types';

export interface MainState {
  token?: string,
  alert?: Alert,
  allCredentails: CredentialsHash
}

interface ActionWithPayload<T> extends Action {
  payload: T;
}

const initialState: MainState = { token: undefined, alert: undefined, allCredentails: {} };

const mainReducer = (state = initialState, action: ActionWithPayload<any>) => {
  switch (action.type) {

    case SIGN_IN:
      return { ...state, token: action.payload };

    case SIGN_OUT:
      return { ...state, token: null };

    case SYNC_ALL_CREDENTIALS:
      const allCredentails = action.payload.reduce((acc: CredentialsHash, credential: Credential) => {
        acc[credential.id] = credential;
        return acc;
      }, {});

      return { ...state, allCredentails }

    case SET_ALERT:
      return { ...state, alert: action.payload };

    case CLEAR_ALERT:
      return { ...state, alert: undefined };

    default:
      return state;
  }
};

export default mainReducer;
