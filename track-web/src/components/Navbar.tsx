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


// import { useOktaAuth } from '@okta/okta-react';
// import * as React from 'react';
// import {
//   Button,
//   Container,
//   Nav,
//   Navbar as BootstrapNavbar,
//   NavDropdown,
//   Spinner,
// } from 'react-bootstrap';
// import { useHistory } from 'react-router-dom';
// import { OktaUser } from '../models/okta';
// import { strings } from '../shared/strings';

// type TrackNavbarProps = {
//   authState: any;
//   authService: any;
//   user?: OktaUser;
//   userIsLoading: boolean;
// };

// export const Navbar: React.FunctionComponent<TrackNavbarProps> = ({
//   // authState,
//   authService,
//   user,
//   userIsLoading,
// }) => {
//   const history = useHistory();
//   const { authState, oktaAuth } = useOktaAuth();

//   const login = async () => history.push(`/login`);

//   // Note: Can't distinguish CORS error from other network errors
//   const isCorsError = (err: any) =>
//     err.name === 'AuthApiError' &&
//     !err.errorCode &&
//     err.xhr.message === 'Failed to fetch';

//   const logout = async () => {
//     try {
//       await authService.signOut();
//     } catch (err) {
//       if (isCorsError(err)) {
//         console.log('what does this do');
//       } else {
//         throw err;
//       }
//     }
//   };
//   const renderLoginButton = () => {
//     return (
//       <>
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
//       </>
//     );
//   };

//   return (
//     <BootstrapNavbar bg="dark" variant="dark">
//       <Container>
//         <Nav className="mr-auto">
//           <BootstrapNavbar.Brand>{strings.brand}</BootstrapNavbar.Brand>
//         </Nav>
//         <Nav>{renderLoginButton()}</Nav>
//       </Container>
//     </BootstrapNavbar>
//   );
// };
/*
 * Copyright (c) 2018, Okta, Inc. and/or its affiliates. All rights reserved.
 * The Okta software accompanied by this notice is provided pursuant to the Apache License, Version 2.0 (the "License.")
 *
 * You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0.
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *
 * See the License for the specific language governing permissions and limitations under the License.
 */

