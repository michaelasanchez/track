import './style/app.scss';
import 'bootstrap/dist/css/bootstrap.css';
import 'chartist-plugin-tooltips-updated/dist/chartist-plugin-tooltip.css';
import 'chartist/dist/chartist.css';

import * as React from 'react';
import * as ReactDOM from 'react-dom';

import Auth from './Auth';

ReactDOM.render(
  <Auth />,
  document.querySelector('main')
)
