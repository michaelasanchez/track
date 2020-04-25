import { Navbar as BootstrapNavbar, Nav } from 'react-bootstrap';
import React, { useState, useEffect } from 'react';
import { OktaUser as User } from '../models/OktaUser';

type TrackNavbarProps = {
  authState: any;
  authService: any;
};

export const Navbar: React.FunctionComponent<TrackNavbarProps> = ({ authState, authService }) => {

  const [user, setUser] = useState(null);

  useEffect(() => {
    authService.getUser().then((d: User) => {
      console.log('Navbar - getUser', d);
    })
  }, [])

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