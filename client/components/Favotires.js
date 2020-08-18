import React, { useContext, useEffect } from 'react';
import useFetch from '../useFetch';
// import FavotiresContext from '../FavoritesContext';

const Favotires = React.memo(({ data, query }) => {
  const [response, isLoading, error] = useFetch(`/api/favorites/${data}`);
  if (isLoading) return <div>Loading...</div>;
  console.log({ response });
  return (
    <div>
      {query && <button>Star</button>}
      <pre>{JSON.stringify(response, null, 2)}</pre>
    </div>
  );
});

export default Favotires;
