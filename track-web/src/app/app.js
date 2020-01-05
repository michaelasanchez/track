import 'bootstrap/dist/css/bootstrap.css';
import '../style/app.css';

import angular from 'angular';
import uirouter from 'angular-ui-router';

import routing from '../app.config';
import home from '../features/home';

let app = () => {
  return {
    template: require('./app.html'),
    controller: 'AppCtrl',
    controllerAs: 'app'
  }
};

class AppCtrl {
  constructor() {
    this.url = 'https://github.com/preboot/angular-webpack';
  }
}

const MODULE_NAME = 'app';

angular.module(MODULE_NAME, [uirouter, home])
  .config(routing)
  .directive('app', app)
  .controller('AppCtrl', AppCtrl);

export default MODULE_NAME;