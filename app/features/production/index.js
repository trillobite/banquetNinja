import angular from 'angular';
import uirouter from 'angular-ui-router';
import states from './states';
import nav from './nav';


export default angular.module('production', [uirouter])
    
    .config(states)
    .config(nav)
    .name