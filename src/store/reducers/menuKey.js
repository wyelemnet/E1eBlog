import { UPDATE_MENU_KEY } from '../types';

const menuKeyReducer = (state = 'home', action) => {
  switch (action.type) {
    case UPDATE_MENU_KEY:
      return action.data;
    default:
      return state;
  }
};
export default menuKeyReducer;
