import React, { useContext } from 'react';
import styled from 'styled-components';
import { Icon, InlineIcon } from '@iconify/react';
import spotifyIcon from '@iconify/icons-mdi/spotify';
import { Redirect } from 'react-router-dom';
import UserContext from '../contexts/UserContext';

const Logo = styled.h1`
  font-size: 4em;
  font-family: 'Ubuntu', sans-serif;
  color: #f44336;
  margin: 1em 0px 0.25em 0px;
`;

const Div = styled.div`
  color: #f44336;
  background-image: url('../assets/background.png');
  background-size: 100%;
  height: 95%;
  background-repeat: repeat-y;
  background-color: #f44336;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1em;
`;
const Button = styled.button`
  font-family: 'Montserrat', sans-serif;
  border: 0px solid black;
  border-radius: 2em;
  background-color: #f44336;
  padding: 0.5em;
  font-size: 15px;
  width: 15em;
  margin-top: 0.5em;
  &:hover {
    color: white;
    cursor: pointer;
    background-color: #43a047;
  }
  &:focus {
    outline: 0px;
  }
  &:active {
    background-color: #00701a;
    transform: translateY(1px);
  }
`;
const Subdiv = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-top: auto;
`;
const SpanCenter = styled.span`
  text-align: center;

  font-family: 'Montserrat', sans-serif;
`;
const Div2 = styled.div`
  margin-bottom: 1em;
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
      <Div2>
        Your virtual getaway. Listen to local music, enjoy the weather, learn the culture.
      </Div2>
      <Icon icon={spotifyIcon} color="#43a047" width="100" height="100" />
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
