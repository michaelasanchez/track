import 'bootstrap/dist/css/bootstrap.css';
import 'chartist/dist/chartist.css';
import 'chartist-plugin-tooltips-updated/dist/chartist-plugin-tooltip.css'; 
import './style/app.scss';

import * as React from "react";
import * as ReactDOM from "react-dom";
import App from './App';

ReactDOM.render(
  <App />,
  document.querySelector('main')
)
