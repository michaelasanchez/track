import { useOktaAuth } from '@okta/okta-react';
import { useEffect, useState } from 'react';

import { Home, HomeProps } from './components/Home';
import { Loading } from './components/Loading';
// import { User } from './components/Navbar';
import { User } from './models/odata';
import { OktaUser } from './models/okta';
import ApiRequest from './utils/Request';

import React = require('react');

type AppProps = {};

const App: React.FunctionComponent<AppProps> = ({}) => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [oktaUser, setOktaUser] = useState<OktaUser>();

  const [homeProps, setHomeProps] = useState<HomeProps>({} as HomeProps);

  const { authState, oktaAuth } = useOktaAuth();

  useEffect(() => {
    if (!authState?.isPending) {
      if (authState.isAuthenticated && !!authState.accessToken?.value) {
        oktaAuth.getUser().then((oktaUser: OktaUser) => {
          setOktaUser(oktaUser);

          console.log('AUTH STATE', authState);

          const datasetRequest = new ApiRequest(null, authState.accessToken.value)
            .Custom('User')
            .then((resp: User) => {
              setHomeProps({
                token: authState.accessToken.value,
                user: resp,
              });
              setIsLoading(false);
            });
        });
      } else {
        setIsLoading(false);
      }
    }
  }, [authState]);

  return (
    <>
      {/* <Navbar
        authState={authState}
        authService={oktaAuth}
        user={oktaUser}
        userIsLoading={isLoading}
      /> */}
      {/* <Loading /> */}
      {isLoading ? <Loading /> : <Home {...homeProps} />}
    </>
  );
};

export default App;
