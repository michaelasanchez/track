import * as React from 'react';
import { Navbar as BootstrapNavbar, Nav } from 'react-bootstrap';
import { useOktaAuth } from '@okta/okta-react';

type TrackNavbarProps = {};

export const Navbar: React.FunctionComponent<TrackNavbarProps> = ({ }) => {
  const { authState, authService } = useOktaAuth();

  const login = async () => {
    // Redirect to '/' after login
    authService.login('/');
  }

  const logout = async () => {
    // Redirect to '/' after logout
    authService.logout('/');
  }

  const renderLoginButton = () => {
    return authState.isAuthenticated ?
      <button onClick={logout}>Logout</button> :
      <button onClick={login}>Login</button>;
  }

  return (
    <BootstrapNavbar bg="dark" variant="dark">
      <Nav className="mr-auto">
        <BootstrapNavbar.Brand>Track</BootstrapNavbar.Brand>
      </Nav>
      <Nav>
        <Nav.Link>{renderLoginButton()}</Nav.Link>
      </Nav>
    </BootstrapNavbar>
  );
}