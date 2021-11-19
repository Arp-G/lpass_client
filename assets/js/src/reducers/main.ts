import { Action } from "redux";

interface MainState {

}

const initialState: MainState = {};

const mainReducer = (state = initialState, action: Action) => {
  switch (action.type) {
    default:
      return state;
  }
};

export default mainReducer;
