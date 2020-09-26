import React, { useEffect } from 'react';
import { getFavs, addFav, removeFav } from '../actions';
import { useThunkReducer } from '../util';
import favoritesReducer from '../reducers';
import Favorite from './Favorite';
import Star from './Star';
import { useIsFavorite } from './customHooks';

const Favorites = ({ setQuery, query, userId }) => {
  const [favorites, dispatch] = useThunkReducer(favoritesReducer, []);
  const favId = useIsFavorite(query, favorites);

  useEffect(() => {
    dispatch(getFavs(userId));
  }, [dispatch, userId]);

  const toggleFav = () => {
    if (favId) return dispatch(removeFav(favId));
    return dispatch(addFav(query, userId));
  };

  const favsToRender = favorites.map((elem, i) => (
    <Favorite key={elem.favorite_id} data={elem} dispatch={dispatch} setQuery={setQuery} />
  ));

  return (
    <div>
      {query && (
        <>
          <Star favId={favId} toggle={toggleFav} />
        </>
      )}
      {favsToRender}
    </div>
  );
};

export default React.memo(Favorites);
