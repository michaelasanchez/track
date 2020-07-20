import React = require('react');
import { Home } from './components/Home';

import { Security, LoginCallback } from '@okta/okta-react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { AUTH_URL, CLIENT_ID } from './config';

type AppProps = {};

const App: React.FunctionComponent<AppProps> = ({ }) => {
  return (
    <Router>
      <Security
        issuer={`${AUTH_URL}/oauth2/default`}
        clientId={CLIENT_ID}
        redirectUri={`${window.location.origin}/callback`}
      >
        <Route path={`/`} component={Home} />
        <Route path={`/callback`} component={LoginCallback} />
      </Security>
    </Router>
  )
} 

export default App;