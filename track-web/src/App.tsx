import React = require('react');
import { Home, BASE_PATH } from './components/Home';

import { Security, LoginCallback } from '@okta/okta-react';
import { BrowserRouter as Router, Route } from 'react-router-dom';

const BASE_URL = 'https://dev-183202.okta.com';
const CLIENT_ID = '0oa3lofhdp9jIJk8B357';

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