import React, { useState, useContext, useReducer, useEffect } from 'react';
import { Redirect } from 'react-router-dom';

import UserContext from './UserContext';

const Home = () => {
  // const { isLoading, isLogged } = useContext(UserContext);
  const [wait, setWait] = useState(true);
  const [imgUrl, setImgUrl] = useState(null);
  useEffect(() => {
    fetch('/api/user')
      .then((res) => res.json())
      .then((data) => {
        setTimeout(() => {
          setImgUrl(data.image_url);
          setWait(false);
        }, 500);
      })
      .catch((err) => console.error(err));
  }, []);

  // if (isLoading || wait) return <div>Loading...</div>;

  return (
    <div>
      WELCOME
      {imgUrl && <img src={imgUrl} />}
    </div>
  );
};

export default Home;
