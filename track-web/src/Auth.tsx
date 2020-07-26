import { LoginCallback, Security } from '@okta/okta-react';
import React = require('react');
import { BrowserRouter as Router, Route } from 'react-router-dom';

import App from './App';
import { AUTH_URL, CLIENT_ID } from './config';

type AuthProps = {};

const Auth: React.FunctionComponent<AuthProps> = ({ }) => {
  return (
    <Router>
      <Security
        issuer={`${AUTH_URL}/oauth2/default`}
        clientId={CLIENT_ID}
        redirectUri={`${window.location.origin}/callback`}
      >
        <Route path={`/`}>
          <App />
        </Route>
        <Route path={`/callback`} component={LoginCallback} />
      </Security>
    </Router>
  )
} 

export default Auth;