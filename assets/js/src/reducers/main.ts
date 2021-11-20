import { Action } from "redux";
import { SIGN_IN } from '../constants/actionTypes';

export interface State {
  token: string | null
}

interface ActionWithPayload<T> extends Action {
  payload: T;
}

const initialState: State = { token: null };

const mainReducer = (state = initialState, action: ActionWithPayload<any>) => {
  switch (action.type) {

    case SIGN_IN:
      return { ...state, token: action.payload }

    default:
      return state;
  }
};

export default mainReducer;
