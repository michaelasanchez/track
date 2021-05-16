// import img from '../public/img/whoa.jpg';
import { OktaAuth, toRelativeUrl } from '@okta/okta-auth-js';
import { LoginCallback, SecureRoute, Security } from '@okta/okta-react';
import * as React from 'react';
import { useState } from 'react';
import { Container } from 'react-bootstrap';
import { Route, Switch, useHistory } from 'react-router-dom';

import App from './App';
import Login from './components/Login';
import Navbar from './components/Navbar';
import { config } from './config';
import CorsErrorModal from './shared/CorsErrorModal';

// import _ = require('lodash');

// const CALLBACK_PATH = '/login/callback';

const oktaAuth = new OktaAuth(config.oidc);

interface AuthProps {}

export const Auth: React.FunctionComponent<AuthProps> = (props) => {
  const history = useHistory(); // example from react-router

  const restoreOriginalUri = async (_oktaAuth: any, originalUri: any) => {
    history.replace(toRelativeUrl(originalUri, window.location.origin));
  };

  const customAuthHandler = () => {
    // Redirect to the /login page that has a CustomLoginComponent
    history.push(`/login`);
  };

  const onAuthResume = async () => {
    history.push(`/login`);
  };

  const [corsErrorModalOpen, setCorsErrorModalOpen] = useState<boolean>(false);

  return (
    <Security
      oktaAuth={oktaAuth}
      onAuthRequired={customAuthHandler}
      restoreOriginalUri={restoreOriginalUri}
    >
      <Navbar {...{ setCorsErrorModalOpen }} />
      <CorsErrorModal {...{ corsErrorModalOpen, setCorsErrorModalOpen }} />
      <Container style={{ marginTop: '7em' }}>
        <Switch>
          <Route path={`/`} exact component={App} />
          <Route
            path={`/login/callback`}
            render={(props) => (
              <LoginCallback {...props} onAuthResume={onAuthResume} />
            )}
          />
          <Route
            path={`/login`}
            render={() => <Login {...{ setCorsErrorModalOpen }} />}
          />
          {/* <SecureRoute path={`/profile`} component={Profile} /> */}
        </Switch>
      </Container>
    </Security>
  );
};
