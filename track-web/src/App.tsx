import { useOktaAuth } from '@okta/okta-react';
import React = require('react');
import { useEffect, useState } from 'react';

import { Home, HomeProps } from './components/Home';
import { Loading } from './components/Loading';
import { Navbar } from './components/Navbar';
import { User } from './models/odata';
import { OktaUser } from './models/okta';
import ApiRequest from './utils/Request';

type AppProps = {};

const App: React.FunctionComponent<AppProps> = ({}) => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [oktaUser, setOktaUser] = useState<OktaUser>();

  const [homeProps, setHomeProps] = useState<HomeProps>({} as HomeProps);

  const { authState, authService } = useOktaAuth();

  useEffect(() => {
    if (!authState?.isPending) {
      if (authState.isAuthenticated) {
        authService.getUser().then((oktaUser: OktaUser) => {
          setOktaUser(oktaUser);

          const datasetRequest = new ApiRequest(null, authState.accessToken)
            .Custom('User')
            .then((resp: User) => {
              setHomeProps({
                token: authState?.accessToken,
                user: resp
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
      <Navbar
        authState={authState}
        authService={authService}
        user={oktaUser}
        userIsLoading={isLoading}
      />
      {/* <Loading /> */}
      {isLoading ? <Loading /> : <Home {...homeProps} />}
    </>
  );
};

export default App;
