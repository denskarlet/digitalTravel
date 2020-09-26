import React from 'react';

const Star = ({ favId, toggle }) => {
  return (
    <>
      <h1>{`${!!favId}`}</h1>
      <button type="button" onClick={toggle}>
        {favId ? 'Remove from fav' : 'Add to fav'}
      </button>
    </>
  );
};

export default Star;
