import { useOktaAuth } from '@okta/okta-react';
import * as React from 'react';
import { Nav, Navbar as BSNavbar } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';

interface NavbarProps {
  setCorsErrorModalOpen: any;
}

const Navbar: React.FunctionComponent<NavbarProps> = (props) => {
  const { setCorsErrorModalOpen } = props;
  const history = useHistory();
  const { authState, oktaAuth } = useOktaAuth();

  const login = async () => history.push(`/login`);

  // Note: Can't distinguish CORS error from other network errors
  const isCorsError = (err: any) =>
    err.name === 'AuthApiError' &&
    !err.errorCode &&
    err.xhr.message === 'Failed to fetch';

  const logout = async () => {
    try {
      await oktaAuth.signOut();
    } catch (err) {
      if (isCorsError(err)) {
        setCorsErrorModalOpen(true);
      } else {
        throw err;
      }
    }
  };

  return (
    <BSNavbar bg="dark" variant="dark">
      <BSNavbar.Brand href={`/`}>Brand</BSNavbar.Brand>
      {/* {authState.isAuthenticated && (
        <Nav.Link href="/messages">Messages</Nav.Link>
      )} */}
      {authState.isAuthenticated && (
        <Nav.Link href={`/profile`}>Profile</Nav.Link>
      )}
      {authState.isAuthenticated && (
        <Nav.Link onClick={logout}>Logout</Nav.Link>
      )}
      {!authState.isPending && !authState.isAuthenticated && (
        <Nav.Link onClick={login}>Login</Nav.Link>
      )}
    </BSNavbar>
  );
};
export default Navbar;
