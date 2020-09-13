import React, { useState } from 'react';
import { removeFav } from '../actions';

const Favorite = ({ data, dispatch, setQuery }) => {
  const { favorite_id } = data;
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
