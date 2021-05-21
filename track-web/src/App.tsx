import * as React from 'react';
import { useAuthContext } from './Auth';
import { Home } from './components/Home';
import { Loading } from './components/Loading';

interface AppProps {}

const App: React.FunctionComponent<AppProps> = ({}) => {
  const { loading, user, token } = useAuthContext();

  // return <Loading />;
  return loading ? <Loading /> : <Home user={user} token={token} />;
};

export default App;
