import React, { useEffect } from 'react';
import { getFavs, addFav } from '../actions';
import { useThunkReducer } from '../util';
import favoritesReducer from '../reducers';
import Favorite from './Favorite';
import useIsFavorite from './customHooks';

const Favorites = ({ setQuery, query, id }) => {
  const [favorites, dispatch] = useThunkReducer(favoritesReducer, []);
  const [isFav, setIsFav] = useIsFavorite(query, favorites);
  useEffect(() => {
    dispatch(getFavs(id));
  }, [dispatch, id]);
  const favsToRender = favorites.map((elem, i) => (
    <Favorite id={id} key={elem.favorite_id} data={elem} dispatch={dispatch} setQuery={setQuery} />
  ));
  return (
    <div>
      {query && (
        <>
          <h1>
            IS FAV:
            {JSON.stringify(isFav)}
          </h1>
          <button
            type="button"
            onClick={() => {
              dispatch(addFav(query, id));
            }}
          >
            Add to fav
          </button>
        </>
      )}
      {favsToRender}
    </div>
  );
};

export default React.memo(Favorites);
