import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';

import { Auth } from './Auth';

import 'bootstrap/dist/css/bootstrap.css';
import 'chartist-plugin-tooltips-updated/dist/chartist-plugin-tooltip.css';
import 'chartist/dist/chartist.css';
import './style/app.scss';

ReactDOM.render(
  <Router>
    <Auth />
  </Router>,
  document.querySelector('.app')
);
