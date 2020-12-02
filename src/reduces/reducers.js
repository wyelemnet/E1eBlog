import { UPDATE_MENU_KEY } from './types';

export const menuKeyReducer = (state, action) => {
  switch (action.type) {
    case UPDATE_MENU_KEY:
      return action.data;
    default:
      return state;
  }
};
