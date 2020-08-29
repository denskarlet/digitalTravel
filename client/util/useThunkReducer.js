import React, { useReducer, useCallback } from 'react';

const useThunkReducer = (reducer, initialState) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const dispatchPro = useCallback(
    (action) => {
      if (typeof action === 'function') {
        action(dispatch);
      } else {
        dispatch(action);
      }
    },
    [dispatch]
  );

  return [state, dispatchPro];
};
export default useThunkReducer;
