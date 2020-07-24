import React, { useEffect, useState } from 'react';
import { Button, Container, Nav, Navbar as BootstrapNavbar, Spinner, NavDropdown } from 'react-bootstrap';

import { OktaUser } from '../models/okta';


type TrackNavbarProps = {
  authState: any;
  authService: any;
};

export const Navbar: React.FunctionComponent<TrackNavbarProps> = ({ authState, authService }) => {

  const [oktaUser, setOktaUser] = useState<OktaUser>();

  const login = async () => {
    // Redirect to '/' after login
    authService.login('/');
  }

  const logout = async () => {
    // Redirect to '/' after logout
    authService.logout('/');
  }

  useEffect(() => {
    authService.getUser()
      .then((user: OktaUser) => setOktaUser(user));
  }, []);

  const renderLoginButton = () => {
    return authState.isAuthenticated ?
      <>
        {oktaUser ?
          <NavDropdown title={oktaUser.email.split('@')[0]} id="logout-dropdown">
            <NavDropdown.Item onClick={logout}>Logout</NavDropdown.Item>
          </NavDropdown>
          :
          <div className="spinner-container">
            <Spinner animation="border" size="sm" variant="secondary" />
          </div>}
      </>
      :
      <Nav.Link>
        <Button onClick={login} className="login" variant="outline-secondary">Login</Button>
      </Nav.Link>
  }

  return (
    <BootstrapNavbar bg="dark" variant="dark">
      <Container>
        <Nav className="mr-auto">
          <BootstrapNavbar.Brand>Track</BootstrapNavbar.Brand>
        </Nav>
        <Nav>
          {renderLoginButton()}
        </Nav>
      </Container>
    </BootstrapNavbar>
  );
}