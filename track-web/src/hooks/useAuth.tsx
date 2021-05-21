import { useOktaAuth } from '@okta/okta-react';
import { useEffect, useState } from 'react';
import { User } from '../models/odata';
import { OktaUser } from '../models/okta';
import ApiRequest from '../utils/Request';

const useAuth = () => {
  const [oktaUser, setOktaUser] = useState<OktaUser>();
  const [loading, setLoading] = useState<boolean>(true);

  const { authState, oktaAuth } = useOktaAuth();

  const [token, setToken] = useState<string>();
  const [user, setUser] = useState<User>();

  useEffect(() => {
    if (!authState?.isPending) {
      if (authState.isAuthenticated && !!authState.accessToken?.value) {
        oktaAuth.getUser().then((oktaUser: OktaUser) => {
          setOktaUser(oktaUser);

          const datasetRequest = new ApiRequest(
            null,
            authState.accessToken.value
          )
            .Custom('User')
            .then((user: User) => {
              setToken(authState.accessToken.value);
              setUser(user);
            })
            .finally(() => setLoading(false));
        });
      } else {
        setLoading(false);
      }
    }
  }, [authState]);

  const signout = async () => {
    await oktaAuth.signOut();
  };

  return {
    isAuthenticated: authState.isAuthenticated,
    isPending: authState.isPending,
    authState,
    loading,
    oktaUser,
    user,
    token,
    signout,
  };
};

export default useAuth;
