import constate from 'constate';
import * as React from 'react';
import { useEffect } from 'react';
import { useAuthContext } from './Auth';
import { Home } from './components/Home';
import { Loading } from './components/Loading';
import { useService } from './hooks';

export const [ServiceProvider, useCategoryService, useDatasetService] =
  constate(
    useService,
    (s) => s.category,
    (s) => s.dataset
  );

interface AppProps {}

const App: React.FunctionComponent<AppProps> = ({}) => {
  const { isAuthenticated, loading, user, token } = useAuthContext();

  return loading ? (
    <Loading />
  ) : (
    <ServiceProvider>
      <Home user={user} token={token} authenticated={isAuthenticated} />
    </ServiceProvider>
  );
};

export default App;
