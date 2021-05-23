import { indexOf } from 'lodash';
import * as React from 'react';
import {
  Button,
  Container,
  Nav,
  Navbar as BootstrapNavbar,
  NavDropdown,
  Spinner,
} from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { Link, useHistory, useLocation } from 'react-router-dom';
import { useAuthContext } from '../Auth';
import { OktaUser } from '../models/okta';
import { strings } from '../shared/strings';

interface NavbarProps {
  setCorsErrorModalOpen: any;
}

const Navbar: React.FunctionComponent<NavbarProps> = (props) => {
  const { setCorsErrorModalOpen } = props;
  const history = useHistory();
  const location = useLocation();

  const onLoginPage = location.pathname === '/login';

  const {
    isPending,
    isAuthenticated,
    loading,
    oktaUser: user,
    user: who,
    signout,
  } = useAuthContext();

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

  const getUserName = (user: OktaUser): string => {
    if (indexOf(user?.preferred_username, '@')) {
      return user.preferred_username.split('@')[0];
    }

    return user.preferred_username;
    // return user.email.split('@')[0];
  }

  const renderLoginButton = () => {
    return (
      <>
        {isPending || (isAuthenticated && loading) ? (
          <div className="spinner-container">
            <Spinner animation="border" size="sm" variant="secondary" />
          </div>
        ) : (
          <>
            {isAuthenticated && user ? (
              <NavDropdown
                title={getUserName(user)}
                id="navbar-dropdown"
              >
                {/* <LinkContainer to="/profile">
                  <NavDropdown.Item>
                    {strings.navbar.profileButtonLabel}
                  </NavDropdown.Item>
                </LinkContainer> */}

                <NavDropdown.Item onClick={logout}>
                  {strings.navbar.logoutButtonLabel}
                </NavDropdown.Item>
              </NavDropdown>
            ) : (
              <Nav.Link>
                <Button
                  onClick={login}
                  className="login"
                  disabled={onLoginPage}
                  variant={'outline-secondary'}
                >
                  {strings.navbar.loginButtonLabel}
                </Button>
              </Nav.Link>
            )}
          </>
        )}
      </>
    );
  };

  return (
    <BootstrapNavbar bg="dark" variant="dark">
      <Container>
        <Nav className="mr-auto">
          <LinkContainer to="/">
            <BootstrapNavbar.Brand>{strings.brand}</BootstrapNavbar.Brand>
          </LinkContainer>
        </Nav>
        <Nav>{renderLoginButton()}</Nav>
      </Container>
    </BootstrapNavbar>
  );
};

export default Navbar;
