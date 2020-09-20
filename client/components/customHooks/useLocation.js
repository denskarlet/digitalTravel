import { useEffect, useState } from 'react';

const useLocation = () => {
  const [location, setLocation] = useState(null);
  useEffect(() => {
    navigator.geolocation.getCurrentPosition((position) => {
      setLocation(position.coords);
    });
  }, []);
  return location;
};
export default useLocation;
