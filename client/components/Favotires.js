import React, { useContext, useEffect } from 'react';
// import FavotiresContext from '../FavoritesContext';

const Favotires = React.memo(({ data, query }) => {
  console.log({ data, query });
  useEffect(() => {
    fetch(`/api/favorites/${data}`)
      .then((res) => {
        return res.json();
      })
      .then((res) => console.log({ res }))
      .catch((err) => console.log(err));
  }, [data]);
  return (
    <div>
      {data}
      {query && <button>Star</button>}
    </div>
  );
});

export default Favotires;
