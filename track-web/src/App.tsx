import React = require('react');
import { Home } from './components/Home';

import { Security, LoginCallback } from '@okta/okta-react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { BASE_URL, CLIENT_ID, BASE_PATH } from './config';

type AppProps = {};

const App: React.FunctionComponent<AppProps> = ({ }) => {
  return (
    <Router>
      <Security
        issuer={`${BASE_URL}/oauth2/default`}
        clientId={CLIENT_ID}
        redirectUri={`${window.location.origin}${BASE_PATH}/callback`}
      >
        <Route path={`${BASE_PATH}/`} component={Home} />
        <Route path={`${BASE_PATH}/callback`} component={LoginCallback} />
      </Security>
    </Router>
  )
} 

export default App;