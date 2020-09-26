import { useEffect, useState } from 'react';

const useIsFavorite = (current, favorites) => {
  const [favId, setFavId] = useState(null);
  useEffect(() => {
    if (!current || !favorites) return;
    const { city, country } = current;
    let id = null;
    for (let i = 0; i < favorites.length; i++) {
      const fav = favorites[i];
      if (fav.city === city && fav.country === country) {
        id = fav.favorite_id;
        break;
      }
    }
    setFavId(id);
  }, [current, favorites]);
  return favId;
};

export default useIsFavorite;
