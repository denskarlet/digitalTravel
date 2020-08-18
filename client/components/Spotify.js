import React from 'react';

const Spotify = ({ data }) => {
  return <pre>{JSON.stringify(data, null, 2)}</pre>;
};

export default Spotify;
