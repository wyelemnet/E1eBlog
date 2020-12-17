import { UPDATE_MENU_KEY } from '../types';

export const changeMenuKey = (menuKey) => {
  return {
    type: UPDATE_MENU_KEY,
    data: menuKey,
  };
};
