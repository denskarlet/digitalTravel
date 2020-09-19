import React, { useState } from 'react';

const Spotify = ({ data }) => {
  const [isLoading, setIsLoading] = useState(true);
  if (!data) return <div>Sorry no spotify here</div>;
  const url = data.split('/');
  return (
    <div>
      {isLoading && <h3>Loading...</h3>}
      <iframe
        title="player"
        src={`https://open.spotify.com/embed/playlist/${url[url.length - 2]}`}
        width="150"
        height="170"
        frameBorder="0"
        onLoad={() => {
          setIsLoading(false);
        }}
        allowransparency="true"
        allow="encrypted-media"
      />
    </div>
  );
};

export default Spotify;
