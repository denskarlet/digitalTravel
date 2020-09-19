import React, { useState, useCallback } from 'react';
import { removeFav } from '../actions';

const Favorite = ({ data, dispatch, setQuery }) => {
  const { favorite_id } = data;
  console.log({ data });
  const handleRemove = useCallback(() => dispatch(removeFav(favorite_id)), [favorite_id, dispatch]);
  return (
    <>
      <pre>{JSON.stringify(data, null, 2)}</pre>
      <button type="button" onClick={handleRemove}>
        Remove
      </button>
      <button type="button" onClick={() => setQuery(data)}>
        GO
      </button>
    </>
  );
};

export default Favorite;
