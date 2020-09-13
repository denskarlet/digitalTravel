export const LOADING = 'LOADING';
export const RESPONSE_COMPLETE = 'RESPONSE_COMPLETE';
export const ERROR = 'ERROR';
export const LOADED_DATA = 'LOADED_DATA';
export const ADD_FAVORITE = 'ADD_FAVORITE';
export const REMOVE_FAVORITE = 'REMOVE_FAVORITE';

export const removeFav = (id) => {
  return (dispatch) => {
    fetch(`/api/favorites/${id}`, {
      method: 'DELETE',
    })
      .then((res) => res.json())
      .then((data) => {
        dispatch({ type: REMOVE_FAVORITE, payload: { data } });
      })
      .catch((err) => console.log(err));
  };
};
export const addFav = (query, userId) => {
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

export const getFavs = (id) => (dispatch) => {
  fetch(`/api/favorites/${id}`)
    .then((res) => res.json())
    .then((data) => {
      dispatch({ type: LOADED_DATA, payload: data });
    })
    .catch((err) => console.log(err));
};
