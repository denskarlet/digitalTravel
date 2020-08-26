import React, { useContext, useEffect, useReducer } from 'react';
import FavotiresContext from '../FavoritesContext';
import { ADD_FAVORITE, REMOVE_FAVORITE, LOADED_DATA } from '../actions/actions';
import useFetch from '../useFetch';
import useThunkReducer from '../useThunkReducer';
import favoritesReducer, { initialState } from '../reducers/favoritesReducer';
import Favorite from './Favorite';

const Favorites = React.memo(({ query, setQuery, id }) => {
  // const { state, dispatch, setQuery, id } = useContext(FavotiresContext);
  // const [initialLoad, loading, error] = useFetch(`api/favorites/${id}`);
  // useEffect(() => {
  //   dispatch({ type: LOADED_DATA, payload: { data: initialLoad } });
  // }, [initialLoad]);
  const [state, dispatch] = useThunkReducer(favoritesReducer, initialState);
  useEffect(() => {
    fetch(`/api/favorites/${id}`)
      .then((res) => res.json())
      .then((data) => dispatch({ type: LOADED_DATA, payload: data }))
      .catch((err) => console.log(err));
  }, []);

  return (
    <div>
      {state.map((elem, i) => (
        <Favorite key={`fav${i}`} data={elem} dispatch={dispatch} setQuery={setQuery} />
      ))}
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
// consider not using context, but just useThunkReducer here and render 'add to fav' component
// since it has access to the current query via session storage.
// only prop drill 'set query'
