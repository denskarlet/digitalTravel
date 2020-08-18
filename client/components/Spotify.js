import React from 'react';

const Spotify = ({ data }) => {
  console.log({ data });
  if (!data) return <div>Sorry no spotify here</div>;
  const url = data.split('/');
  return (
    <iframe
      src={`https://open.spotify.com/embed/playlist/${url[url.length - 2]}`}
      width="300"
      height="300"
      frameBorder="0"
      allowransparency="true"
      allow="encrypted-media"
    ></iframe>
  );
};

export default Spotify;
