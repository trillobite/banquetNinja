
// name: 'Users',
// sortOrder: 30,
// sref: 'root.users',
// parent: 'User Admin',
// endSection: false,
// roles: ['bronze', 'silver', 'gold', 'admin', 'superUser']
import _ from 'lodash';

export default function Navigation(graph, tmIdentity){
    
    function treeify(list, idAttr, parentAttr, childrenAttr) {
        // if (!idAttr) idAttr = 'name';
        // if (!parentAttr) parentAttr = 'parent';
        // if (!childrenAttr) childrenAttr = 'links';
        idAttr = idAttr || 'name';
        parentAttr = parentAttr || 'parent';
        childrenAttr = childrenAttr || 'links';
    
        var treeList = [];
        
        var lookup = {};
        
        if(tmIdentity.isAuthenticated()){
            list.forEach(function(obj) {
                if(_.intersection(tmIdentity.currentUser.user.roles, obj['roles']).length > 0){
                    
                    lookup[obj[idAttr]] = obj;
                    obj[childrenAttr] = [];
                }
            });
            
            list.forEach(function(obj) {
                if(_.intersection(tmIdentity.currentUser.user.roles, obj['roles']).length > 0){
                    if (obj[parentAttr] != null) {
                        lookup[obj[parentAttr]][childrenAttr].push(obj);
                    } else {
                        treeList.push(obj);
                    }
                }
            });
            return treeList;
        } else {
            return treeList;
        }
    };
    
    this.navigation = treeify(graph);
    this.reloadNav = function(){return treeify(graph);};
}