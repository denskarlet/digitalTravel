import React, { useState, useEffect, useReducer } from 'react';
import fetchReducer, { initialState } from './fetchReducer';
import { LOADING, RESPONSE_COMPLETE, ERROR } from '../actions';

const useFetch = (url) => {
  const [state, dispatch] = useReducer(fetchReducer, initialState);
  useEffect(() => {
    dispatch({ type: LOADING });
    fetch(url)
      .then((res) => {
        if (res.status < 200 || res.status >= 300) {
          throw new Error(res.statusText);
        }
        return res.json();
      })
      .then((data) => {
        setTimeout(() => dispatch({ type: RESPONSE_COMPLETE, payload: { data } }), 500);
      })
      .catch((error) => dispatch({ type: ERROR, payload: { error } }));
  }, [url]);
  const { response, loading, error } = state;
  return [response, loading, error];
};

export default useFetch;
