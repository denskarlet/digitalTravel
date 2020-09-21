import { useEffect, useState } from 'react';

const useLocation = () => {
  const [location, setLocation] = useState(null);
  useEffect(() => {
    navigator.geolocation.getCurrentPosition((position) => {
      const { latitude, longitude } = position.coords;
      fetch(`/api/currentlocation?lat=${latitude}&lng=${longitude}`)
        .then((res) => res.json())
        .then((data) => {
          setLocation(data);
        })
        .catch((err) => console.log(err));
    });
  }, []);
  return location;
};
export default useLocation;
