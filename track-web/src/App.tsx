import * as React from 'react';
import { useAuthContext } from './Auth';
import { Home } from './components/Home';
import { Loading } from './components/Loading';

interface AppProps {}

const App: React.FunctionComponent<AppProps> = ({}) => {
  const { isAuthenticated, loading, user, token } = useAuthContext();

  return loading ? <Loading /> : <Home user={user} token={token} authenticated={isAuthenticated} />;
};

export default App;
