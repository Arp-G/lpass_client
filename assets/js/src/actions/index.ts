import { Dispatch } from 'react';
import { createAction, Action } from 'redux-actions';
import { batchActions } from 'redux-batched-actions';
import { delMany } from "idb-keyval";
import Api from './../api/api';
import {
  SAVE_CONNECTIVITY_STATUS,
  SIGN_IN,
  SIGN_OUT,
  SAVE_LPASS,
  SAVE_ALL_CREDENTIALS,
  ADD_OR_UPDATE_CREDENTIAL,
  DELETE_CREDENTIAL,
  SET_ALERT,
  CLEAR_ALERT,
  SET_SYNC_MODAL,
  TOGGLE_SYNC_LOADER,
  SAVE_DARK_MODE,
  TOGGLE_DARK_MODE
} from '../constants/actionTypes';
import { Credential, MessageType } from '../Types/Types';

const setConnectivityStatusAction = createAction<boolean>(SAVE_CONNECTIVITY_STATUS);
const saveLpassPasswordAction = createAction<string | null>(SAVE_LPASS);
const signInAction = createAction<string | null>(SIGN_IN);
const signOutAction = createAction<void>(SIGN_OUT);
const saveAllCredentialsAction = createAction<Credential[] | undefined>(SAVE_ALL_CREDENTIALS);
const addOrUpdateCredentialAction = createAction<Credential>(ADD_OR_UPDATE_CREDENTIAL);
const deleteCredentialAction = createAction<string>(DELETE_CREDENTIAL);
const alertAction = createAction<{ message: string, type: MessageType, timeout?: number }>(SET_ALERT);
const toggleSyncModalAction = createAction<boolean>(SET_SYNC_MODAL);
const toggleSyncyingAction = createAction<void>(TOGGLE_SYNC_LOADER);
const clearAlertAction = createAction<void>(CLEAR_ALERT);
const saveDarkModeAction = createAction<boolean>(SAVE_DARK_MODE);
const toggleDarkModeAction = createAction<void>(TOGGLE_DARK_MODE);

const handleForbiddenResponse = (dispatch: Dispatch<any>, error: any, elseCallback: () => void) => {
  const dispatchSignOut = signOut(dispatch);

  if (error?.response?.status === 403) {
    dispatchSignOut();
    dispatch(alertAction({ message: 'Login expired, Login to continue!', type: 'WARNING', timeout: 3000 }));
  } else {
    elseCallback();
  }
}

export const setConnectivityStatus = (dispatch: Dispatch<any>) => {
  return (status: boolean) => {
    const actions: Action<any>[] = [setConnectivityStatusAction(status)];
    if (!status) actions.push(alertAction({ message: 'You are Offline!', type: 'WARNING' }));

    dispatch(createBatchAction(actions))
  };
};


export const checkLoginStatusAndInitLocalState = (dispatch: Dispatch<any>) => {
  return (token: string | null, allCredentials: Credential[], darkMode: boolean | undefined) => {
    const dispatchSignOut = signOut(dispatch);
    const dark = darkMode === undefined ? window.matchMedia('(prefers-color-scheme: dark)').matches : darkMode;
    dispatch(saveDarkModeAction(dark));

    return Api.get('/login_status')
      .then(response => {

        if (!response?.data?.logged_in) {
          dispatchSignOut();
          return;
        }

        dispatch(createBatchAction([
          signInAction(token),
          allCredentials && saveAllCredentialsAction(allCredentials)
        ]));

      }).catch(() => {
        dispatchSignOut();
      });
  };
}

export const signIn = (dispatch: Dispatch<any>) => {
  return (
    lpassUsername: string,
    serverPassword: string,
    lpassPassword: string,
    saveToken: ((token: string | undefined) => void) | undefined
  ) => {
    return Api.post('/sign_in', { lpassUsername, serverPassword, lpassPassword })
      .then((response) => {
        dispatch(
          createBatchAction([
            signInAction(response.data.token),
            saveLpassPasswordAction(lpassPassword),
            alertAction({ message: 'Sign in success!', type: 'SUCCESS', timeout: 3000 })
          ])
        );

        // Persist token in indexDB
        saveToken && saveToken(response.data.token);
      }).catch(err => {
        console.log(err.message);
        dispatch(alertAction({ message: 'Incorrect credentials, please try again!', type: 'WARNING', timeout: 3000 }));
      });
  };
};

export const signOut = (dispatch: Dispatch<any>, message = false) => {
  return () => {
    const actions: Action<any>[] = [];

    return Api.post('/sign_out')
      .then(() => message && actions.push(alertAction({ message: 'Logged out successfully!', type: 'SUCCESS', timeout: 3000 })))
      .catch(() => message && actions.push(alertAction({ message: 'Something went wrong, logged out locally!', type: 'ERROR' })))
      .finally(() => {
        delMany(['token', 'allCredentials'])
          .then(() => {
            dispatch(createBatchAction([
              signOutAction(),
              ...actions
            ]));
          })
      });
  }
};

export const saveCredential = (dispatch: Dispatch<any>, mode: 'CREATE' | 'UPDATE') => {
  return (
    { id, name, url, username, password, note }
      : { id?: string, name: string, url: string, username: string, password: string, note: string }
  ) => {
    return (
      mode === 'CREATE' ?
        Api.post('/credentials', { name, url, username, password, note }).then(response => {
          const responsHasId = response.data.id && response.data.id !== 0;
          dispatch(createBatchAction([
            responsHasId && addOrUpdateCredentialAction({ id: response.data.id, name, url, username, password, note }),
            alertAction({ message: 'Saved!', type: 'SUCCESS' })
          ]));
        }) :
        Api.patch(`/credentials/${id}`, { name, url, username, password, note })
          .then(_response => {
            dispatch(createBatchAction([
              addOrUpdateCredentialAction({ id: id || getDummyId(), name, url, username, password, note }),
              alertAction({ message: 'Updated!', type: 'SUCCESS' })
            ]));
          })
    ).catch(err => {
      console.log(err.message);
      handleForbiddenResponse(
        dispatch,
        err,
        () => dispatch(alertAction({ message: 'Failed, try again!', type: 'ERROR' }))
      );
    })
  };
};

export const deleteCredential = (dispatch: Dispatch<any>) => {
  return (id: string) => {
    return Api.delete(`/credentials/${id}`)
      .then(_response => {
        // Update in local state
        dispatch(createBatchAction([
          deleteCredentialAction(id),
          alertAction({ message: 'Deleted!', type: 'SUCCESS' })
        ]));
      }).catch(err => {
        console.log(err.message);
        handleForbiddenResponse(
          dispatch,
          err,
          () => dispatch(alertAction({ message: 'Failed, try again!', type: 'ERROR' }))
        );
      });
  };
};

export const fetchAllCredentials = (dispatch: Dispatch<any>) => {
  return (password: string, setAllCredentials: (credentials: Credential[] | undefined) => void) => {
    dispatch(toggleSyncyingAction());

    return Api.post('/export', { password })
      .then(response => {
        // Save in index db
        setAllCredentials(response.data.data);

        dispatch(createBatchAction([
          saveAllCredentialsAction(response.data.data),
          toggleSyncModalAction(false),
          saveLpassPasswordAction(password),
          alertAction({ message: 'Synced successfully!', type: 'SUCCESS' }),
          toggleSyncyingAction()
        ]));
      }).catch(err => {
        console.log(err.message);
        handleForbiddenResponse(
          dispatch,
          err,
          () => dispatch(
            createBatchAction([
              alertAction({ message: 'Failed, try again!', type: 'ERROR' }),
              toggleSyncyingAction()
            ]))
        );
      });
  };
}

export const setSyncModal = (dispatch: Dispatch<any>) => {
  return (open: boolean) => {
    dispatch(toggleSyncModalAction(open))
  }
};

export const clearAlert = (dispatch: Dispatch<any>) => () => dispatch(clearAlertAction());

export const toggleDarkMode = (dispatch: Dispatch<any>) => () => dispatch(toggleDarkModeAction());

// Helper functions
const createBatchAction = (actionArray: (Action<any>)[]) => batchActions(actionArray.filter(action => action));
const getDummyId = () => `dummy-${Date.now().toString()}`;