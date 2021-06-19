import constate from 'constate';
import * as React from 'react';
import { useAuthContext } from './Auth';
import { Home } from './components/state/Home';
import { Loading } from './components/ui/Loading';
import { useService } from './hooks';

export const [
  ServiceProvider,
  useCategoryService,
  useDatasetService,
  useRecordService,
] = constate(
  useService,
  (s) => s.category,
  (s) => s.dataset,
  (s) => s.record
);

const App: React.FunctionComponent<{}> = () => {
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
