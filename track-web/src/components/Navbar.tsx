import { useOktaAuth } from '@okta/okta-react';
import * as React from 'react';
import { Navbar as BootstrapNavbar, Container, Nav } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';

import { strings } from '../shared/strings';

interface NavbarProps {
  setCorsErrorModalOpen: any;
}

// interface TrackNavbarProps {
//   authState: any;
//   authService: any;
//   user?: OktaUser;
//   userIsLoading: boolean;
// };

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
  //         {authState.isPending ||
  //         (authState.isAuthenticated && !user && userIsLoading) ? (
  //           <div className="spinner-container">
  //             <Spinner animation="border" size="sm" variant="secondary" />
  //           </div>
  //         ) : (
  //           <>
  //             {authState.isAuthenticated && user ? (
  //               <NavDropdown
  //                 title={user.email.split('@')[0]}
  //                 id="logout-dropdown"
  //               >
  //                 <NavDropdown.Item onClick={logout}>
  //                   {strings.navbar.logoutButtonLabel}
  //                 </NavDropdown.Item>
  //               </NavDropdown>
  //             ) : (
  //               <Nav.Link>
  //                 <Button
  //                   onClick={login}
  //                   className="login"
  //                   variant="outline-secondary"
  //                 >
  //                   {strings.navbar.loginButtonLabel}
  //                 </Button>
  //               </Nav.Link>
  //             )}
  //           </>
  //         )}

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
