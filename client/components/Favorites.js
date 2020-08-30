import React, { useContext, useEffect, useReducer, useState } from 'react';
import { ADD_FAVORITE, REMOVE_FAVORITE, LOADED_DATA } from '../actions/actions';
import useThunkReducer from '../util/useThunkReducer';
import favoritesReducer, { initialState } from '../reducers/favoritesReducer';
import Favorite from './Favorite';

const addFav = (query, userId) => {
  console.log({ query, userId });
  const send = {
    city: query.city_name,
    country: query.country_name,
    lng: query.lng,
    lat: query.lat,
    user_id: userId,
  };
  return (dispatch) => {
    fetch(`/api/favorites`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(send),
    })
      .then((res) => res.json())
      .then((data) => {
        dispatch({ type: ADD_FAVORITE, payload: { data } });
      })
      .catch((err) => console.log(err));
  };
};

const getFavs = (id) => {
  return (dispatch) => {
    fetch(`/api/favorites/${id}`)
      .then((res) => res.json())
      .then((data) => {
        dispatch({ type: LOADED_DATA, payload: data });
      })
      .catch((err) => console.log(err));
  };
};

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
const Favorites = React.memo(({ setQuery, query, id }) => {
  const [favorites, dispatch] = useThunkReducer(favoritesReducer, initialState);
  const [isFav, setIsFav] = useState(false);

  useEffect(() => {
    dispatch(getFavs(id));
  }, []);

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
});

export default Favorites;
