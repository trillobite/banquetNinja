import angular from 'angular';
import lodash from 'lodash';
import ninjaSchemas from 'ninjaSchemas';
import config from 'config';

function tmContractDetailCtrl(
    $scope,
    tmDetailFactory,
    tmContractDocSvc,
    $timeout,
    uibDateParser,
    $state
) {
    var self = this;
    var constructorArgs = {
        $scope: $scope,
        docSvc: tmContractDocSvc,
        schema: ninjaSchemas.events.Contract,
        model: "Contract",
        listView: "root.contracts",
        detailView: "root.contractDetail",
        addHeaderText: "Add Contract"
    };

    this.__proto__ = tmDetailFactory(constructorArgs);


    this.sectionsHidden = true;
    this.menuGroups = [];
    this.menuObjs = [];
    this.filterSection = undefined;

    self.models = { newEventStep: {} };

    _.forEach(ninjaSchemas.events.Contract.paths.eventSteps.schema.paths, (item, key) => {
        self.models.newEventStep[key] = null;
    }, {});

    this.addEventStep = function () {
        self.models.newEventStep.time.setMilliseconds(0);
        self.models.newEventStep.time.setSeconds(0);
        this.docSvc.addTimeline(self.models.newEventStep);
        self.models.newEventStep = _.mapValues(self.models.newEventStep, () => null);
    };

    this.moreFunctions.print = {
        label: "Print HTML",
        method: function () {
            $state.go('root.contracts.print', { id: self.docSvc.doc._id });
        }
    };


    this.moreFunctions.pdf = {
        label: "Print PDF",
        method: function () {

            let url = `${config.apiBase}/events/contracts/${self.$stateParams.id}/view/pdf`;
            var req = {
                method: 'GET',
                url: url,
                responseType: 'arraybuffer'
            };
            self.$http(req).then(function (result) {
                console.log(result);
                var file = new Blob([result.data], { type: 'application/pdf' });
                var fileURL = URL.createObjectURL(file);
                window.open(fileURL);
            });
        }
    };


    this.contractStatusOptions = constructorArgs.schema.paths.status.enumValues.map((status) => status);

    this.serviceTypeOptions = constructorArgs.schema.paths.serviceType.enumValues.map((serviceTypes) => serviceTypes);

    this.moreFunctions.addItem.method = function () {

        var dialogConfig = {
            template: require('apply!./addContract.jade'),
            controller: 'tmAddContractCtrl as vm',
            locals: {
                model: 'Contract',
                schema: self.constructorArgs.schema,
                listView: self.constructorArgs.listView,
                detailView: self.constructorArgs.detailView,
                headerText: self.constructorArgs.addHeaderText,
                hideCustomerInput: false
            }
        };
        self.tmDialogSvc.showDialog(dialogConfig);
    };

    this.$scope.$watch(function () {
        return self.docSvc.isDirty();
    }, function (newVal, oldVal, scope) {
        if (newVal) {
            self.detailForm.$setDirty();
        } else {
            self.detailForm.$setPristine();
            self.detailForm.$setUntouched();
        }
    });

    this.loadData().then((data) => {
        this.getDetailTitle();
        // let lookups = this.docSvc.$dataSource.load('Lookups');
        // lookups.query().then((returned) => {
        //     console.log("lookups:", returned);
        //     this.menuItemCategories = returned.menuItemTags;
        //     console.log("menuItemCategories:", this.menuItemCategories);
        // });

        // I would like to load up Menu Groups also...
        let menuGroups = this.docSvc.$dataSource.load("MenuGroup");
        menuGroups.query().then((returned) => {
            console.log("menuGroups:", returned);
            this.menuGroups = returned;
            // returned.map((obj) => {
            //     this.menuGroups.push(obj.name);
            // });
            console.log("menuGroups:", this.menuGroups);
        });
    });

    // this.searchMenuItem = function () {
    //     let url = `${config.apiBase}/production/menuitems?where[categories]=${this.searchCategory}&like[name]=${this.searchName}`;
    //     let request = {
    //         method: "GET",
    //         url: url
    //     };
    //     this.$http(request).then((data) => {
    //         self.addableMenuItems = data.data.data;
    //     });
    // };

    let cleanup = () => {
        // for some reason searchGroup doesn't change when selecting another group...

        this.menuObjs = []; //make sure this is clean.
        this.addableMenuItems = [];
        this.filterMenu = undefined;
        this.filterSection = undefined;
    }

    this.getMenus = () => {
        console.log("searchGroup:", this.searchGroup);

        cleanup();

        this.searchGroup.menus.map((menu) => {

            let Menu = this.docSvc.$dataSource.load("Menu");
            Menu.query({ "_id": menu.menuId }).then((returned) => {
                console.log("returned:", returned);
                this.menuObjs.push(returned);
            });

        });

        self.sectionsHidden = false; //unhide...
    };

    // this.searchMenus = () => {
    //     console.log("searchGroup", this.searchGroup);

    //     let url = `${config.apiBase}/production/menus?like[name]=${this.searchGroup.name}`;
    //     let request = {
    //         method: "GET",
    //         url: url,
    //     };
    //     this.$http(request).then((data) => {
    //         console.log("data", data);

    //         let menuSections = [];
    //         // let menuSectionsRawData = [];

    //         data.data.data.map((obj) => {
    //             obj.sections.map((tmp) => {
    //                 menuSections.push(tmp.title);
    //                 // menuSectionsRawData.push(tmp);
    //             });
    //         });

    //         this.menuSections = menuSections;
    //         // self.menuSectionsRawData = menuSectionsRawData;
    //         this.sectionsHidden = false; //unhide...

    //         // console.log("menuSectionsRawData", menuSectionsRawData);
    //         console.log("menuSections", menuSections);
    //     });
    // };

    // this.getCachedMenuItems = (section) => {
    //     let sectionItems = [];
    //     self.menuSectionsRawData.map((obj) => {
    //         if (obj.title == section) {
    //             sectionItems = obj.items;
    //         }
    //     });
    //     //self.addableMenuItems = sectionItems;
    //     return sectionItems;
    // };

    this.showMenuItems = () => {
        this.addableMenuItems = this.filterSection.items;
        // self.addableMenuItems = self.getCachedMenuItems(self.filterSection);
    };

    this.getDetailTitle = function () {
        const customer = self.docSvc.doc.customer;
        if (customer) {
            self.detailTitle = {
                leader: 'Event for: ',
                text: `${customer.lastName}, ${customer.firstName}`
            };
        } else {
            self.detailTitle = {
                leader: 'Event for: ',
                text: 'unknown customer'
            }
        }
    };

    this.sideTab = {
        menuItems: false,
        rentalItems: false,
        timeline: false,
        rooms: false,
        commLog: false
    };

    this.openSideTab = function (tab) {
        for (var k in this.sideTab) {
            this.sideTab[k] = false;
        }
        this.sideTab[tab] = true;
    };

    this.closeSideTab = function () {
        for (var k in this.sideTab) {
            this.sideTab[k] = false;
        }
    };

    this.removeVenue = function (index) {
        self.docSvc.removeVenue(index);
    };

    this.addItem = (item) => {
        console.log("adding this:", item);
        console.log("menuItems:", this.docSvc.doc.menuItems);
        this.docSvc.doc.menuItems.push(item);
    };



    this.format = 'shortDate';
    this.timeFormat = 'h:mm a';
    this.datePickerOptions = {
        //dateDisabled: disabled,
        formatYear: 'yy',
        maxDate: new Date(2020, 5, 22),
        minDate: new Date(),
        startingDay: 1
    };
    this.status = {
        timePickerOpen: false,
        datePickerOpen: false
    };
    this.openDatePicker = function () {
        this.status.datePickerOpen = true;
    };
    this.closeTimePicker = function () {
        this.status.timePickerOpen = false;
    };

    this.doneEditing = function (item) {
        delete item.isEditing;
        delete item.clickedField;
    };

    this.editMenuItem = function (item, index, clickedField) {
        if (index < 0 || index > this.docSvc.doc.menuItems.length - 1) return;
        $timeout(function () {
            item.isEditing = true;
            item.clickedField = {};
            item.clickedField[clickedField] = true;
        }, 0);

    };

    this.arrowKeyOut = function (item, index, event, clickedField) {
        if (event.keyCode == 38) {
            this.editMenuItem(this.docSvc.doc.menuItems[--index], index--, clickedField);
        }
        if (event.keyCode == 40) {
            this.editMenuItem(this.docSvc.doc.menuItems[++index], index++, clickedField);
        }
    };

    this.detailBlur = function (item, index, event) {
        var relatedTarget = event.relatedTarget || event.explicitOriginalTarget;
        if (relatedTarget == null || event.target.parentElement.parentElement != relatedTarget.parentElement.parentElement) {
            $timeout(function () {
                delete item.isEditing;
                delete item.clickedField;
            }, 0);

        }
    };

    this.deleteMenuItem = function (index) {
        this.docSvc.removeMenuItem(index);
    };

    this.removeRentalItem = function (index) {
        this.docSvc.removeRentalItem(index);
    }


    return this;

}

tmContractDetailCtrl.$inject = [
    '$scope',
    'tmDetailFactory',
    'tmContractDocSvc',
    '$timeout',
    'uibDateParser',
    '$state'
];

export default tmContractDetailCtrl;