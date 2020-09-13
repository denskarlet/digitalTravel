import React, { useContext, useEffect, useReducer, useState } from 'react';
import { getFavs, addFav } from '../actions';
import useThunkReducer from '../util/useThunkReducer';
import favoritesReducer, { initialState } from '../reducers/favoritesReducer';
import Favorite from './Favorite';

const isSelected = (favs, current) => {
  const { city_name, country_name } = current;
  let found = false;
  for (let i = 0; i < favs.length; i++) {
    if (city_name === favs[i].city_name && country_name === favs[i].country_name) {
      found = true;
      break;
    }
  }
  return found;
};
const Favorites = ({ setQuery, query, id }) => {
  const [favorites, dispatch] = useThunkReducer(favoritesReducer, initialState);
  const [isFav, setIsFav] = useState(false);

  useEffect(() => {
    dispatch(getFavs(id));
  }, [dispatch, id]);

  useEffect(() => {
    if (!query) return;
    setIsFav(isSelected(favorites, query));
  }, [query, favorites]);

  const favsToRender = favorites.map((elem, i) => (
    <Favorite id={id} key={elem.favorite_id} data={elem} dispatch={dispatch} setQuery={setQuery} />
  ));
  return (
    <div>
      <h1>
        IS FAV:
        {JSON.stringify(isFav)}
      </h1>
      {query && (
        <button
          type="button"
          onClick={() => {
            dispatch(addFav(query, id));
            setIsFav(true);
          }}
        >
          CLICK
        </button>
      )}
      {favsToRender}
    </div>
  );
};

export default React.memo(Favorites);
