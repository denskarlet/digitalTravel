import React, { useContext, useEffect } from 'react';
import FavotiresContext from '../FavoritesContext';
import { ADD_FAVORITE, REMOVE_FAVORITE, LOADED_DATA } from '../actions/actions';
import useFetch from '../useFetch';

const Favorites = React.memo(({ query }) => {
  const { state, dispatch, setQuery, id } = useContext(FavotiresContext);
  console.log({ state, dispatch, setQuery, id });
  const [initialLoad, loading, error] = useFetch(`api/favorites/${id}`);

  useEffect(() => {
    dispatch({ type: LOADED_DATA, payload: { data: initialLoad } });
  }, [initialLoad]);

  return (
    <div>
      {state && state.map((elem, i) => <pre key={`fav${i}`}>{JSON.stringify(elem, null, 2)}</pre>)}
      <button
        onClick={() => {
          dispatch({ type: ADD_FAVORITE, payload: { data: { a: 1, b: 2, c: 3 } } });
        }}
      >
        CLICK
      </button>
    </div>
  );
});

export default Favorites;
