import React, { useContext, useEffect } from 'react';
import useFetch from '../useFetch';
// import FavotiresContext from '../FavoritesContext';

const Favotires = React.memo(({ data, query, setQuery }) => {
  const [response, isLoading, error] = useFetch(`/api/favorites/${data}`);
  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      {query && <button>Star</button>}
      <pre>{JSON.stringify(response, null, 2)}</pre>
      <button
        onClick={() => {
          setQuery(sessionStorage.getItem('query'));
          // console.log(sessionStorage.getItem('query'));
        }}
      >
        CLICK
      </button>
    </div>
  );
});

export default Favotires;
