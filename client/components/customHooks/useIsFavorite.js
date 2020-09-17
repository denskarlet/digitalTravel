import { useEffect, useState } from 'react';

const useIsFavorite = (current, favorites) => {
  const [selected, setSelected] = useState(false);
  useEffect(() => {
    if (!current || !favorites) return;
    const { city_name, country_name } = current;
    const found = favorites.some(
      (elem) => elem.city_name === city_name && elem.country_name === country_name
    );
    setSelected(found);
  }, [current, favorites]);
  return [selected];
};

export default useIsFavorite;
