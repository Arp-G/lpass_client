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
  SET_SYNCED,
  SET_OFFLINE
} from '../constants/actionTypes';
import { CredentialsHash, Credential, Group, AlertType } from '../Types/Types';
import { PREDEFINED_GROUPS } from '../constants/misc';

export interface MainState {
  online: boolean,
  token?: string,
  alert?: AlertType,
  syncModal: boolean,
  allCredentials: CredentialsHash,
  lastpass: string | null,
  syncing: boolean,
  syncedOnce: boolean,
  darkMode: boolean | undefined,
  groups: Group[],
  allowOffline: boolean
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
  syncing: false,
  syncedOnce: false,
  darkMode: undefined,
  groups: [],
  allowOffline: false
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

      const groups = new Set<string>(
        [
          ...action.payload.map(({ group }: { group: string }) => group),
          ...PREDEFINED_GROUPS
        ].filter(group => group).map((group: string) => group.toLowerCase())
      );

      return {
        ...state,
        allCredentials,
        groups: Array.from(groups)
          .sort()
          .map(function (group, id) {
            return { group: group.charAt(0).toUpperCase() + group.slice(1), id };
          })
      };

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
      return { ...state, syncing: !state.syncing };

    case SET_ALERT:
      return { ...state, alert: action.payload };

    case CLEAR_ALERT:
      return { ...state, alert: undefined };

    case SAVE_DARK_MODE:
      return { ...state, darkMode: action.payload };

    case TOGGLE_DARK_MODE:
      return { ...state, darkMode: !state.darkMode };

    case SET_OFFLINE:
      return { ...state, allowOffline: action.payload };

    default:
      return state;
  }
};

export default mainReducer;
