import React, { useState, useEffect, useReducer } from 'react';
import fetchReducer, { initialState } from './reducers/fetchReducer';
import { LOADING, RESPONSE_COMPLETE, ERROR } from './actions/actions';

const useFetch = (url) => {
  const [state, dispatch] = useReducer(fetchReducer, initialState);

  useEffect(() => {
    dispatch({ type: LOADING });
    fetch(url)
      .then((res) => res.json())
      .then((data) => dispatch({ type: RESPONSE_COMPLETE, payload: { data } }))
      .catch((err) => dispatch({ type: ERROR, payload: { err } }));
  }, [url]);

  const { response, loading, error } = state;
  return [response, loading, error];
};

export default useFetch;
