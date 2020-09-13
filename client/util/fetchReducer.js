const { ERROR, LOADING, RESPONSE_COMPLETE } = require('../actions');

export const initialState = {
  error: null,
  loading: true,
  response: null,
};

const fetchReducer = (state, { type, payload }) => {
  if (type === ERROR)
    return {
      error: payload.error,
      loading: false,
      response: null,
    };

  if (type === LOADING)
    return {
      error: null,
      loading: true,
      response: null,
    };

  if (type === RESPONSE_COMPLETE)
    return {
      error: null,
      loading: false,
      response: payload.data,
    };

  return state;
};
export default fetchReducer;
