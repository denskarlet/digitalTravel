import React from 'react';

const Country = ({ data }) => {
  return <pre> {JSON.stringify(data, null, 2)}</pre>;
};

export default Country;
