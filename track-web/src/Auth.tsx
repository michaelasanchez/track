import { OktaAuth, toRelativeUrl } from '@okta/okta-auth-js';
import { LoginCallback, SecureRoute, Security } from '@okta/okta-react';
import constate from 'constate';
import * as React from 'react';
import { useState } from 'react';
import { Route, Switch, useHistory } from 'react-router-dom';
import App from './App';
import Login from './components/Login';
import Navbar from './components/Navbar';
import Profile from './components/Profile';
import { config } from './config';
import useAuth from './hooks/useAuth';
import CorsErrorModal from './shared/CorsErrorModal';

const oktaAuth = new OktaAuth(config.oidc);

export const [AuthProvider, useAuthContext] = constate(useAuth);

interface AuthProps {}

export const appPaths = [`/`, '/create', '/edit', '/dev'];

export const Auth: React.FunctionComponent<AuthProps> = (props) => {
  const history = useHistory();

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
      <AuthProvider>
        <header>
          <Navbar {...{ setCorsErrorModalOpen }} />
        </header>
        <main>
          <CorsErrorModal {...{ corsErrorModalOpen, setCorsErrorModalOpen }} />
          <Switch>
            <Route path={appPaths} exact component={App} />
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
            <SecureRoute path={`/profile`} component={Profile} />
          </Switch>
        </main>
      </AuthProvider>
    </Security>
  );
};
