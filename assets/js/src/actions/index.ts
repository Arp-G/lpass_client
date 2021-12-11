import { Dispatch } from 'react';
import { createAction, Action } from 'redux-actions';
import { batchActions } from 'redux-batched-actions';
import { delMany } from "idb-keyval";
import Api from './../api/api';
import {
  SIGN_IN,
  SIGN_OUT,
  SAVE_ALL_CREDENTIALS,
  ADD_OR_UPDATE_CREDENTIAL,
  DELETE_CREDENTIAL,
  SET_ALERT,
  CLEAR_ALERT,
  SET_SYNC_MODAL
} from '../constants/actionTypes';
import { Credential, MessageType } from '../Types/Types';

const signInAction = createAction<string | null>(SIGN_IN);
const signOutAction = createAction<void>(SIGN_OUT);
const saveAllCredentials = createAction<Credential[] | undefined>(SAVE_ALL_CREDENTIALS);
const addOrUpdateCredentialAction = createAction<Credential>(ADD_OR_UPDATE_CREDENTIAL);
const deleteCredentialAction = createAction<string>(DELETE_CREDENTIAL);
const alertAction = createAction<{ message: string, type: MessageType, timeout?: number }>(SET_ALERT);
const toggleSyncModalAction = createAction<boolean>(SET_SYNC_MODAL);
const clearAlertAction = createAction<void>(CLEAR_ALERT);

const handleForbiddenResponse = (dispatch: Dispatch<any>, error: any, elseCallback: () => void) => {
  const dispatchSignOut = signOut(dispatch);
  console.log(error?.response?.status)
  if (error?.response?.status === 403) {
    dispatchSignOut();
    dispatch(alertAction({ message: 'Login expired, Login to continue!', type: 'WARNING', timeout: 3000 }));
  } else {
    elseCallback();
  }
}

export const checkLoginStatusAndInitLocalState = (dispatch: Dispatch<any>) => {
  return (token: string | null, allCredentials: Credential[]) => {
    const dispatchSignOut = signOut(dispatch);

    return Api.get('/login_status')
      .then(response => {

        if (!response?.data?.logged_in) {
          dispatchSignOut();
          return;
        }

        dispatch(batchActions([
          signInAction(token),
          allCredentials && saveAllCredentials(allCredentials)
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
    return Api.post('/sign_in', { lpassUsername, serverPassword, lpassPassword }).then((response) => {
      dispatch(
        batchActions([
          signInAction(response.data.token),
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
            actions.unshift(signOutAction())
            dispatch(batchActions([
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
          const actions = [alertAction({ message: 'Saved!', type: 'SUCCESS' })];
          if (response.data.id && response.data.id === 0)
            addOrUpdateCredentialAction({ id: response.data.id, name, url, username, password, note })

          dispatch(batchActions(actions));
        }) :
        Api.patch(`/credentials/${id}`, { name, url, username, password, note })
          .then(_response => {
            dispatch(batchActions([
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
        dispatch(batchActions([
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
    return Api.post('/export', { password })
      .then(response => {
        // Save in index db
        setAllCredentials(response.data.data);

        dispatch(batchActions([
          saveAllCredentials(response.data.data),
          toggleSyncModalAction(false),
          alertAction({ message: 'Success!', type: 'SUCCESS' })
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
}

export const setSyncModal = (dispatch: Dispatch<any>) => {
  return (open: boolean) => {
    dispatch(toggleSyncModalAction(open))
  }
};

export const clearAlert = (dispatch: Dispatch<any>) => {
  return () => dispatch(clearAlertAction());
};

const getDummyId = () => `dummy-${Date.now().toString()}`;
