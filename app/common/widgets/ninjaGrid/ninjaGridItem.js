

function ninjaGridItemCtrl ($timeout) {
    var $ctrl = this;
    
    $ctrl.deleteItem = function(item) {
        $ctrl.onDeleteItem(item);
    };
    
    $ctrl.doneEditing = function(item){
        delete item.isEditing;
        delete item.clickedField;
    };
    
    $ctrl.editItem = function(item, clickedField) {
        console.log(item);
        $timeout(function(){
            item.isEditing = true;
            item.clickedField = {};
            item.clickedField[clickedField] = true;
        },0);
    };
    
    $ctrl.arrowKeyOut = function(item, event, currentField){
        console.log(item);
        if (event.keyCode == 38) {
            $ctrl.doneEditing(item);
            $ctrl.onArrowKeyOut({item: item, keyCode: 'up', currentField: currentField});
        }
        if (event.keyCode == 40) {
            $ctrl.doneEditing(item);
            $ctrl.onArrowKeyOut({item: item, keyCode: 'down',  currentField: currentField});
        }
    };
    
    
    $ctrl.detailBlur = function (item, event) {
        console.log(item);
        var relatedTarget = event.relatedTarget || event.explicitOriginalTarget;
        if (relatedTarget == null || event.target.parentElement.parentElement != relatedTarget.parentElement.parentElement ) {
            $timeout(function(){
                delete item.isEditing;
                delete item.clickedField;
            }, 0);
            
        } 
    };
    
    $ctrl.sort = function (startIndex, insertIndex) {
        $ctrl.onSort({startIndex: startIndex, insertIndex: insertIndex});
    };
    
}

ninjaGridItemCtrl.$inject = ['$timeout'];

var ninjaGridItem = {
    template: require('!raw!jade-html!./ninjaGridItem.jade'),
    controller: ninjaGridItemCtrl,
    bindings: {
        item: '<',
        fields: '<',
        onDeleteItem: '&',
        onEditItem: '&',
        onUpdateItem: '&',
        onCreateItem: '&',
        onArrowKeyOut: '&',
        onSort: '&'
    }
};

export default ninjaGridItem;