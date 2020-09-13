const { LOADED_DATA, ADD_FAVORITE, REMOVE_FAVORITE } = require('../actions');

export const initialState = [];

const favoritesReducer = (state, { type, payload }) => {
  if (type === LOADED_DATA) return payload;

  if (type === ADD_FAVORITE) return [payload.data, ...state];

  if (type === REMOVE_FAVORITE)
    return state.filter((elem) => elem.favorite_id !== payload.data.favorite_id);

  return state;
};
export default favoritesReducer;
