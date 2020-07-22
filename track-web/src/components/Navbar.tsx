import React from 'react';
import { Navbar as BootstrapNavbar, Button, Nav } from 'react-bootstrap';

type TrackNavbarProps = {
  authState: any;
  authService: any;
};

export const Navbar: React.FunctionComponent<TrackNavbarProps> = ({ authState, authService }) => {

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
      <Button onClick={logout} className="logout" variant="dark">Logout</Button>
      :
      <Button onClick={login} className="login" variant="outline-secondary">Login</Button>;
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