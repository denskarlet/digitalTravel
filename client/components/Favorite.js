import React, { useState } from 'react';
import { REMOVE_FAVORITE, ADD_FAVORITE } from '../actions/actions';

const removeFav = (id) => {
  return (dispatch) => {
    fetch(`/api/favorites/${id}`, {
      method: 'DELETE',
    })
      .then((res) => res.json())
      .then((data) => {
        dispatch({ type: REMOVE_FAVORITE, payload: { data } });
      })
      .catch((err) => console.log(err));
  };
};

const Favorite = ({ data, dispatch, setQuery }) => {
  const { favorite_id } = data;
  // console.log(JSON.parse(sessionStorage.getItem('query')));
  return (
    <>
      <pre>{JSON.stringify(data, null, 2)}</pre>
      <button type="button" onClick={() => dispatch(removeFav(favorite_id))}>
        Remove
      </button>
      <button type="button" onClick={() => setQuery(data)}>
        GO
      </button>
    </>
  );
};

export default Favorite;
