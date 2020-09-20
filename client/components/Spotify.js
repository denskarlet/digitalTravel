import React, { useState } from 'react';
import ClipLoader from 'react-spinners/ClipLoader';

const Spotify = ({ data }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [minified, setMinified] = useState(true);
  if (!data) return <div>Sorry no spotify here</div>;
  const url = data.split('/');
  return (
    <div style={{ display: 'flex', flexDirection: 'row' }}>
      <button type="button" onClick={() => setMinified(!minified)}>
        {minified ? 'Expand' : 'Minify'}
      </button>
      <div style={{ background: 'red', height: '80px', width: '300px' }}>
        <iframe
          title="player"
          src={`https://open.spotify.com/embed/playlist/${url[url.length - 2]}`}
          width="300"
          height={minified ? '80' : '580'}
          frameBorder="0"
          onLoad={() => {
            setIsLoading(false);
          }}
          allowransparency="true"
          allow="encrypted-media"
        />
      </div>
    </div>
  );
};

export default Spotify;
