import * as React from 'react';
import {
  Button,
  Container,
  Nav,
  Navbar as BootstrapNavbar,
  NavDropdown,
  Spinner,
} from 'react-bootstrap';
import { useHistory } from 'react-router-dom';
import { useAuthContext } from '../Auth';
import { strings } from '../shared/strings';

interface NavbarProps {
  setCorsErrorModalOpen: any;
}

const Navbar: React.FunctionComponent<NavbarProps> = (props) => {
  const { setCorsErrorModalOpen } = props;
  const history = useHistory();

  const { authState, loading, oktaUser: user, signout } = useAuthContext();

  const login = async () => history.push(`/login`);

  // Note: Can't distinguish CORS error from other network errors
  const isCorsError = (err: any) =>
    err.name === 'AuthApiError' &&
    !err.errorCode &&
    err.xhr.message === 'Failed to fetch';

  const logout = async () => {
    try {
      await signout();
    } catch (err) {
      if (isCorsError(err)) {
        setCorsErrorModalOpen(true);
      } else {
        throw err;
      }
    }
  };

  const renderLoginButton = () => {
    return (
      <>
        {authState.isAuthenticated && (
          <Nav.Link href={`/profile`}>Profile</Nav.Link>
        )}
        {authState.isAuthenticated && (
          <Nav.Link onClick={logout}>Logout</Nav.Link>
        )}
        {!authState.isPending && !authState.isAuthenticated && (
          <Nav.Link onClick={login}>Login</Nav.Link>
        )}
      </>
    );
  };
  {
    authState.isPending || (authState.isAuthenticated && !user && loading) ? (
      <div className="spinner-container">
        <Spinner animation="border" size="sm" variant="secondary" />
      </div>
    ) : (
      <>
        {authState.isAuthenticated && user ? (
          <NavDropdown title={user.email.split('@')[0]} id="logout-dropdown">
            <NavDropdown.Item onClick={logout}>
              {strings.navbar.logoutButtonLabel}
            </NavDropdown.Item>
          </NavDropdown>
        ) : (
          <Nav.Link>
            <Button
              onClick={login}
              className="login"
              variant="outline-secondary"
            >
              {strings.navbar.loginButtonLabel}
            </Button>
          </Nav.Link>
        )}
      </>
    );
  }

  return (
    <BootstrapNavbar bg="dark" variant="dark">
      <Container>
        <Nav className="mr-auto">
          <BootstrapNavbar.Brand href={`/`}>
            {strings.brand}
          </BootstrapNavbar.Brand>
        </Nav>
        {/* {authState.isAuthenticated && (
        <Nav.Link href="/messages">Messages</Nav.Link>
      )} */}
        <Nav>{renderLoginButton()}</Nav>
      </Container>
    </BootstrapNavbar>
  );
};

export default Navbar;
