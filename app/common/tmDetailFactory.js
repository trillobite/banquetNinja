function tmDetailFactory(
    $http,
    $q,
    $state,
    $stateParams,
    $dataSource,
    tmNotifier,
    tmDialogSvc,
    tmWindowStorage

) {
    return function (constructorArgs) {
        return new BaseDetail(
            $http,
            $q,
            $state,
            $stateParams,
            $dataSource,
            tmNotifier,
            tmDialogSvc,
            tmWindowStorage,
            constructorArgs
        );
    };
}

tmDetailFactory.$inject = [
    '$http',
    '$q',
    '$state',
    '$stateParams',
    '$dataSource',
    'tmNotifier',
    'tmDialogSvc',
    'tmWindowStorage'
];

export default tmDetailFactory;

function BaseDetail(
    $http,
    $q,
    $state,
    $stateParams,
    $dataSource,
    tmNotifier,
    tmDialogSvc,
    tmWindowStorage,
    constructorArgs
) {
    this.constructorArgs = constructorArgs;

    var self = this;
    this.$scope = constructorArgs.$scope;
    this.isLoading = false;
    this.$stateParams = $stateParams;
    console.log("constructorArgs:", constructorArgs);
    console.log("$dataSource:", $dataSource);
    this.Model = $dataSource.load(this.constructorArgs.model);
    this.tmNotifier = tmNotifier;
    this.tmDialogSvc = tmDialogSvc;
    this.tmWindowStorage = tmWindowStorage;
    this.$state = $state;
    this.$q = $q;
    this.$http = $http;
    this.docSvc = constructorArgs.docSvc;
    //this.docSvc.loadDocument($stateParams.id);
    this.constructorArgs = constructorArgs;


    this.moreFunctions = {
        addItem: {
            label: constructorArgs.addHeaderText,
            method: function () {
                self.addItem();
            }
        },
        refresh: {
            label: "Refresh",
            method: function () {
                self.docSvc.refreshFromServer();
            }
        },
        delete: {
            label: "Delete",
            method: function () {
                console.log(self);
                var dialogOptions = {
                    closeButtonText: 'No',
                    actionButtonText: 'Yes',
                    headerText: 'Delete?',
                    bodyText: 'Do you want to delete this record and all associated data?'
                };
                self.tmDialogSvc.showDialog({}, dialogOptions).then(function () {
                    self.docSvc.deleteDocument();

                    console.log("tmDetailFactory, self.Model:", self.Model);

                    // self.Model.remove(id).then(function (collection) {
                    //     self.tmNotifier.notify("The item has been deleted");
                    //     self.items = collection;
                    // });

                    //fixes bug where after closing the window, it brings us back to Contracts list.
                    self.$state.go(self.$state.back.fromState, self.$state.back.fromParams);

                }, function () {
                    //currently an empty anonymous function?
                    console.log("delete method was called!");
                });
            }
        }
    };



    this.setLoading = function (loading) {
        this.isLoading = loading;
    };

    this.getDetailTitle = function () {
        self.detailTitle = 'Detail';
    };

    this.loadData = function () {
        var self = this;
        self.setLoading(true);
        self.getDetailTitle();
        return this.docSvc.loadDocument(this.$stateParams.id).then(function (doc) {
            self.setLoading(false);
            return doc;
        });
    };

    this.addItem = function () {
        var self = this;
        this.canILeave().then(function (canILeave) {
            if (canILeave) {
                var dialogConfig = {
                    template: require('apply!./tmDialogAddItem.jade'),
                    controller: 'tmDialogAddItemCtrl as vm',
                    locals: {
                        model: self.constructorArgs.model,
                        schema: self.constructorArgs.schema,
                        listView: self.constructorArgs.listView,
                        detailView: self.constructorArgs.detailView,
                        headerText: self.constructorArgs.addHeaderText
                    }
                };
                self.tmDialogSvc.showDialog(dialogConfig);

            }
        });
    };

    this.reset = function () {
        var self = this;
        self.docSvc.undoChanges();
        self.detailForm.$setPristine();
        self.detailForm.$setUntouched();
    };

    this.allowTransitionAway = function () {
        return this.$scope.vm.detailForm.$pristine;
    };

    this.canILeave = function () {
        var deferred = this.$q.defer();
        var canILeave = false;
        if (this.allowTransitionAway()) {
            canILeave = true;
            deferred.resolve(canILeave);
        } else {
            var dialogOptions = {
                closeButtonText: 'No',
                actionButtonText: 'Yes',
                headerText: 'Wait!',
                bodyText: 'Do you want to leave without saving??'
            };
            this.tmDialogSvc.showDialog({}, dialogOptions).then(function (result) {
                canILeave = true;
                deferred.resolve(canILeave);
            }, function (result) {
                canILeave = false;
                deferred.resolve(canILeave);
            });
        }
        return deferred.promise;
    };


    this.close = function () {
        var self = this;
        this.canILeave().then(function (canILeave) {
            if (canILeave) {
                self.docSvc.clearDocument();
                self.$state.go(self.$state.back.fromState, self.$state.back.fromParams);

                //self.$state.go(constructorArgs.listView);
            }
        });
    };

    this.saveChanges = function (saveAndGo) {
        var self = this;
        self.setLoading(true);
        saveAndGo = self.closeButtonText === 'Save and Close' ? true : false;
        this.docSvc.saveChanges().then(function () {
            self.detailForm.$setPristine();
            self.detailForm.$setUntouched();
            self.getDetailTitle();
            self.tmNotifier.detailNotify("The item has been saved.");
            self.setLoading(false);
            if (saveAndGo) {
                self.close();
            }
        }, function (err) {
            console.log(err);
            self.tmNotifier.error("There was a problem with saving...try again.");
        });
    };

    this.setUISettings = function () {
        this.tmWindowStorage.setLocalKey('closeDropDown', this.closeButtonText);
    };

    this.getUISettings = function () {
        var dropDownText = this.tmWindowStorage.getLocalKey('closeDropDown');
        if (!dropDownText) {
            this.closeButtonText = 'Save and Stay';
        } else {
            this.closeButtonText = dropDownText;
        }
    };

    this.openSaveMenu = function ($mdOpenMenu, ev) {
        $mdOpenMenu(ev);
    };

    this.setSaveButton = function (text) {
        this.tmWindowStorage.setLocalKey('closeDropDown', text);
        this.closeButtonText = text;
        this.saveChanges();
    };

    this.closeButton = function () {
        this.saveChanges();
    };

    this.openMoreMenu = function ($mdOpenMenu, ev) {
        $mdOpenMenu(ev);
    };

    this.getUISettings();
}

