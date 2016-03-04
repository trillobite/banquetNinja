import angular from 'angular';
import uirouter from 'angular-ui-router';

import uibs from 'angular-ui-bootstrap';

import states from './states';
import nav from './nav';
import data from './data';

import tmContractsCtrl from './contracts/tmContractsCtrl';
import tmVenuesCtrl from './venues/tmVenuesCtrl';
import tmRentalItemsCtrl from './rentalitems/tmRentalItemsCtrl';

import tmContractDocSvc from './contracts/tmContractDocSvc';
import tmRentalItemDocSvc from './rentalitems/tmRentalItemDocSvc';
import tmVenueDocSvc from './venues/tmVenueDocSvc';

import tmContractDetailCtrl from './contracts/tmContractDetailCtrl';
import tmRentalItemDetailCtrl from './rentalitems/tmRentalItemDetailCtrl';
import tmVenueDetailCtrl from './venues/tmVenueDetailCtrl';
import tmAddContractCtrl from './contracts/tmAddContractCtrl';



export default angular.module('events', [uirouter, uibs])

    .config(states)
    .config(nav)
    .config(data)
    .factory('tmContractDocSvc', tmContractDocSvc)
    .factory('tmRentalItemDocSvc', tmRentalItemDocSvc)
    .factory('tmVenueDocSvc', tmVenueDocSvc)
    .controller("tmContractsCtrl", tmContractsCtrl)
    .controller("tmVenuesCtrl", tmVenuesCtrl)
    .controller("tmRentalItemsCtrl", tmRentalItemsCtrl)
    .controller('tmContractDetailCtrl', tmContractDetailCtrl)
    .controller('tmRentalItemDetailCtrl', tmRentalItemDetailCtrl)
    .controller('tmAddContractCtrl', tmAddContractCtrl)
    .controller('tmVenueDetailCtrl', tmVenueDetailCtrl)
    .name