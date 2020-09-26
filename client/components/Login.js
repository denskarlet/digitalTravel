import React, { useContext } from 'react';
import styled from 'styled-components';
import { Icon, InlineIcon } from '@iconify/react';
import spotifyIcon from '@iconify/icons-mdi/spotify';
import { Redirect } from 'react-router-dom';
import UserContext from '../contexts/UserContext';

const Div = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 12%;
`;
const Button = styled.button`
  border: 1px solid black;
  border-radius: 2em;
  background-color: green;
  padding: 0.5em;
  font-size: 15px;
  width: 15em;
  &:hover {
    color: white;
    cursor: pointer;
  }
`;
const Span = styled.span`
  color: red;
  margin-top: 10em;
`;

const Login = () => {
  const { isLogged } = useContext(UserContext);
  if (isLogged) return <Redirect to="/" />;
  const handleClick = () => {
    window.location.assign('/api/authenticate');
  };
  return (
    <Div>
      <h1>Digital Trip</h1>
      <Icon icon={spotifyIcon} color="green" width="100" height="100" />
      <Button type="button" onClick={handleClick}>
        Log in with Spotify
      </Button>
      <Span> For the best experience, you must have Spotify account.</Span>
    </Div>
  );
};

export default Login;
