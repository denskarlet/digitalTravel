import React from 'react';

const Welcome = ({ userData }) => {
  const { image_url, name } = userData;
  return (
    <div>
      <img alt="http://placehold.jp/50x50.png" src={image_url} height="50" width="50" />
      <h3>{`Welcome, ${name}!`}</h3>
    </div>
  );
};
export default Welcome;
