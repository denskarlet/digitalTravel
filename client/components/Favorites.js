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
const Favorites = React.memo(({ setQuery, query, id }) => {
  const [state, dispatch] = useThunkReducer(favoritesReducer, initialState);
  const [yes, setYes] = useState(false);
  console.log({ query });
  useEffect(() => {
    dispatch(getFavs(id));
  }, []);

  useEffect(() => {
    if (!query) return;
    const checkIfFav = (query, state) => {
      const { city_name, country_name } = query;
      let found = false;
      for (let i = 0; i < state.length; i++) {
        if (city_name === state[i].city_name && country_name === state[i].country_name) {
          setYes(true);
          found = true;
        }
        if (!found) setYes(false);
      }
    };
    checkIfFav(query, state);
  }, [query, state]);

  return (
    <div>
      <h1>
        IS FAV:
        {JSON.stringify(yes)}
      </h1>
      {query && (
        <button
          type="button"
          onClick={() => {
            dispatch(addFav(query, id));
            setYes(true);
          }}
        >
          CLICK
        </button>
      )}
      {state.map((elem, i) => (
        <Favorite
          id={id}
          key={elem.favorite_id}
          data={elem}
          dispatch={dispatch}
          setQuery={setQuery}
        />
      ))}
    </div>
  );
});

export default Favorites;
