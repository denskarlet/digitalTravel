import { useEffect, useState } from 'react';

const useLocation = () => {
  const [location, setLocation] = useState(null);
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        fetch(`/api/currentlocation?lat=${latitude}&lng=${longitude}`)
          .then((res) => res.json())
          .then((data) => {
            setLocation(data);
          })
          .catch((err) => console.log(err));
      },
      (error) => {
        console.log({ error });
        setLocation(false);
      },
      { timeout: 5000 }
    );
  }, []);
  return location;
};
export default useLocation;
