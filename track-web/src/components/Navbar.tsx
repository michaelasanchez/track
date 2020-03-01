import * as React from 'react';

import { Navbar as BootstrapNavbar } from 'react-bootstrap';

type TrackNavbarProps = {};

export const Navbar: React.FunctionComponent<TrackNavbarProps> = ({ }) => {
  return (
    <BootstrapNavbar bg="dark" variant="dark">
      <BootstrapNavbar.Brand>Track</BootstrapNavbar.Brand>
    </BootstrapNavbar>
  );
}