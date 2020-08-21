import React, { useState } from 'react';
import { REMOVE_FAVORITE } from '../actions/actions';
const Favorite = ({ data, dispatch }) => {
  const { favorite_id } = data;

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
  return (
    <>
      <pre>{JSON.stringify(data, null, 2)}</pre>
      <button onClick={() => dispatch(removeFav(favorite_id))}>Remove</button>
    </>
  );
};

export default Favorite;
