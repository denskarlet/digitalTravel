import React, { useState } from 'react';
import { REMOVE_FAVORITE } from '../actions/actions';
const Favorite = ({ data, dispatch, setQuery }) => {
  const { favorite_id } = data;
  console.log({ data });
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
      <button onClick={() => setQuery(data)}>GO</button>
    </>
  );
};

export default Favorite;
