import 'bootstrap/dist/css/bootstrap.css';
import 'chartist/dist/chartist.css';
import './style/app.scss';

import * as React from "react";
import * as ReactDOM from "react-dom";

import { Home } from './components/Home';


ReactDOM.render(
  <Home />,
  document.querySelector('main')
)
