import { useState } from 'react';
import { Home, HomeProps } from './components/Home';
import { Loading } from './components/Loading';
import useAuth from './hooks/useAuth';

import React = require('react');
import { useAuthContext } from './Auth';

type AppProps = {};

const App: React.FunctionComponent<AppProps> = ({}) => {
  const { loading: isLoading, user, token } = useAuthContext();

  return (
    <>
      {/* <Navbar
        authState={authState}
        authService={oktaAuth}
        user={oktaUser}
        userIsLoading={isLoading}
      /> */}
      {/* <Loading /> */}
      {isLoading ? <Loading /> : <Home user={user} token={token} />}
    </>
  );
};

export default App;
