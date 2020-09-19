import { useEffect, useState } from 'react';

const useIsFavorite = (current, favorites) => {
  const [selected, setSelected] = useState(false);
  useEffect(() => {
    if (!current || !favorites) return;
    const { city, country } = current;
    const found = favorites.some((elem) => elem.city === city && elem.country === country);
    setSelected(found);
  }, [current, favorites]);
  return [selected];
};

export default useIsFavorite;
