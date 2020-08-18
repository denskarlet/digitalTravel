import React from 'react';

const Weather = ({ data }) => {
  return <pre>{JSON.stringify(data, null, 2)}</pre>;
};

export default Weather;
