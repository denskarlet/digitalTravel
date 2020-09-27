import React, { useContext } from 'react';
import styled from 'styled-components';
import { Icon, InlineIcon } from '@iconify/react';
import spotifyIcon from '@iconify/icons-mdi/spotify';
import { Redirect } from 'react-router-dom';
import UserContext from '../contexts/UserContext';

const Logo = styled.h1`
  font-size: 4em;
  font-family: 'Ubuntu', sans-serif;
  color: green;
`;
const Div = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 8em;
  height: 80%;
`;
const Button = styled.button`
  font-family: 'Montserrat', sans-serif;

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
const Subdiv = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding-top: 10rem;
  align-self: center;
  color: red;
`;
const SpanCenter = styled.span`
  text-align: center;
  color: red;
  font-family: 'Montserrat', sans-serif;
`;
const Div2 = styled.div`
  font-family: 'Montserrat', sans-serif;
`;

const Login = () => {
  const { isLogged } = useContext(UserContext);
  if (isLogged) return <Redirect to="/" />;
  const handleClick = () => {
    window.location.assign('/api/authenticate');
  };
  return (
    <Div>
      <Logo>Digital Trip</Logo>
      <Div2>Your virtual getaway.</Div2>
      <Icon icon={spotifyIcon} color="green" width="100" height="100" />
      <Button type="button" onClick={handleClick}>
        Log in with Spotify
      </Button>
      <Subdiv>
        {' '}
        <SpanCenter>
          {' '}
          Please use desktop and allow location access for the best experience.
        </SpanCenter>
        <br />
        <SpanCenter>You must have spotify account to use the website.</SpanCenter>
      </Subdiv>
    </Div>
  );
};

export default Login;
