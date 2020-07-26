import React, { useEffect, useState } from "react";
import {
  Navbar as BootstrapNavbar,
  Button,
  Container,
  Nav,
  NavDropdown,
  Spinner,
} from "react-bootstrap";

import { OktaUser } from "../models/okta";
import { strings } from "../shared/strings";

type TrackNavbarProps = {
  authState: any;
  authService: any;
  user?: OktaUser;
  userIsLoading: boolean;
};

export const Navbar: React.FunctionComponent<TrackNavbarProps> = ({
  authState,
  authService,
  user,
  userIsLoading,
}) => {
  const login = async () => {
    // Redirect to '/' after login
    authService.login("/");
  };

  const logout = async () => {
    // Redirect to '/' after logout
    authService.logout("/");
  };

  const renderLoginButton = () => {
    return (
      <>
        {authState.isPending || (authState.isAuthenticated && !user && userIsLoading) ? (
          <div className="spinner-container">
            <Spinner animation="border" size="sm" variant="secondary" />
          </div>
        ) : (
          <>
            {authState.isAuthenticated && user ? (
              <NavDropdown
                title={user.email.split("@")[0]}
                id="logout-dropdown"
              >
                <NavDropdown.Item onClick={logout}>{strings.navbar.logoutButtonLabel}</NavDropdown.Item>
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
        )}
      </>
    );
  };

  return (
    <BootstrapNavbar bg="dark" variant="dark">
      <Container>
        <Nav className="mr-auto">
          <BootstrapNavbar.Brand>{strings.brand}</BootstrapNavbar.Brand>
        </Nav>
        <Nav>{renderLoginButton()}</Nav>
      </Container>
    </BootstrapNavbar>
  );
};
