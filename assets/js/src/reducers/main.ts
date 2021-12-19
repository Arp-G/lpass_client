import { Action } from "redux";
import {
  SAVE_CONNECTIVITY_STATUS,
  SIGN_IN,
  SIGN_OUT,
  SAVE_LPASS,
  SAVE_ALL_CREDENTIALS,
  SET_SYNC_MODAL,
  TOGGLE_SYNC_LOADER,
  SET_ALERT,
  CLEAR_ALERT,
  ADD_OR_UPDATE_CREDENTIAL,
  DELETE_CREDENTIAL,
  SAVE_DARK_MODE,
  TOGGLE_DARK_MODE,
  SET_SYNCED
} from '../constants/actionTypes';
import { CredentialsHash, Credential, AlertType } from '../Types/Types';

export interface MainState {
  online: boolean,
  token?: string,
  alert?: AlertType,
  syncModal: boolean,
  allCredentials: CredentialsHash,
  lastpass: string | null,
  syncying: boolean,
  syncedOnce: boolean,
  darkMode: boolean | undefined
}

interface ActionWithPayload<T> extends Action {
  payload: T;
}

const initialState: MainState = {
  online: true,
  token: undefined,
  alert: undefined,
  syncModal: false,
  allCredentials: {},
  lastpass: null,
  syncying: false,
  syncedOnce: false,
  darkMode: undefined
};

const mainReducer = (state = initialState, action: ActionWithPayload<any>) => {
  switch (action.type) {

    case SAVE_CONNECTIVITY_STATUS:
      return state.online === action.payload ? state : { ...state, online: action.payload };

    case SIGN_IN:
      return { ...state, token: action.payload };

    case SIGN_OUT:
      return { ...state, token: null, allCredentials: {} };

    case SAVE_LPASS:
      return { ...state, lastpass: action.payload };

    case SET_SYNCED:
      return { ...state, syncedOnce: true };

    case SAVE_ALL_CREDENTIALS:
      const allCredentials = action.payload.reduce((acc: CredentialsHash, credential: Credential) => {
        acc[credential.id] = credential;
        return acc;
      }, {});

      return { ...state, allCredentials };

    case ADD_OR_UPDATE_CREDENTIAL:
      const currDateTime = new Date().toISOString();
      return {
        ...state,
        allCredentials: {
          ...state.allCredentials,
          [action.payload.id]: {
            ...action.payload,
            last_modified_gmt: currDateTime,
            last_touch: currDateTime
          }
        }
      };

    case DELETE_CREDENTIAL:
      const credentials = Object.entries(state.allCredentials)
        .filter(([id, _credential]) => id !== action.payload);

      return { ...state, allCredentials: Object.fromEntries(credentials) };

    case SET_SYNC_MODAL:
      return { ...state, syncModal: action.payload };

    case TOGGLE_SYNC_LOADER:
      return { ...state, syncying: !state.syncying };

    case SET_ALERT:
      return { ...state, alert: action.payload };

    case CLEAR_ALERT:
      return { ...state, alert: undefined };

    case SAVE_DARK_MODE:
      return { ...state, darkMode: action.payload }

    case TOGGLE_DARK_MODE:
      return { ...state, darkMode: !state.darkMode }

    default:
      return state;
  }
};

export default mainReducer;
