import angular from 'angular';
import lodash from 'lodash';
import ninjaSchemas from 'ninjaSchemas';

function tmContractDetailCtrl (
    $scope,
    tmDetailFactory,
    tmContractDocSvc,
    $timeout,
    uibDateParser
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
    }
    
    this.__proto__ = tmDetailFactory(constructorArgs);
    
    
    this.$scope.$watch(function(){
        return self.docSvc.isDirty();
    }, function(newVal, oldVal,  scope){
        if(newVal){
            self.detailForm.$setDirty();
        } else {
            self.detailForm.$setPristine();
            self.detailForm.$setUntouched();
        }
    });
    
    this.loadData().then(function(){
        self.getDetailTitle();
        //self.docSvc.doc.eventDate = new Date(self.docSvc.doc.eventDate);
        //self.docSvc.doc.eventTime = new Date(self.docSvc.doc.eventTime);
    });
    
    this.getDetailTitle = function(){
        self.detailTitle = self.docSvc.doc.customer.lastName + ' - ' + self.docSvc.doc.eventName;
    };
    
    this.detailBlur = function (item, index, event) {
        var relatedTarget = event.relatedTarget || event.explicitOriginalTarget;
        if (relatedTarget == null || event.target.parentElement.parentElement != relatedTarget.parentElement.parentElement ) {
            $timeout(function(){
                delete item.isEditing;
                delete item.clickedField;
            }, 0)
            
        } 
    }
    
    this.format = 'shortDate';
    this.timeFormat = 'h:mm a';
    this.datePickerOptions = {
        //dateDisabled: disabled,
        formatYear: 'yy',
        maxDate: new Date(2020, 5, 22),
        minDate: new Date(),
        startingDay: 1
    };
    this.status = {timePickerOpen: false,
        datePickerOpen: false
    };
    this.openDatePicker = function(){
        this.status.datePickerOpen = true;
    };
    this.closeTimePicker = function(){
        this.status.timePickerOpen = false;
    };
    
    this.doneEditing = function(item){
        delete item.isEditing;
        delete item.clickedField;
    };
    
    this.editMenuItem = function (item, index, clickedField){
        $timeout(function(){
            console.log('ngClick');
            item.isEditing = true;
            item.clickedField = {};
            item.clickedField[clickedField] = true;
        },0);

    }
    
    this.deleteMenuItem = function (index){
        this.docSvc.removeMenuItem(index);
    };
    
    
    return this;
    
}

tmContractDetailCtrl.$inject = [
    '$scope',
    'tmDetailFactory',
    'tmContractDocSvc',
    '$timeout',
    'uibDateParser'
];

export default tmContractDetailCtrl;