export default ['navigationProvider', function(navigationProvider){
        
        
        
        navigationProvider.addNav({
            name: 'Menu Groups',
            sortOrder: 30,
            sref: 'root.menugroups',
            parent: 'Production',
            endSection: false,
            roles: ['bronze', 'silver', 'gold', 'admin', 'superUser']
        });
        navigationProvider.addNav({
            name: 'Menus',
            sortOrder: 40,
            sref: 'root.menus',
            parent: 'Production',
            endSection: false,
            roles: ['bronze', 'silver', 'gold', 'admin', 'superUser']
        });
        navigationProvider.addNav({
            name: 'Menu Items',
            sortOrder: 50,
            sref: 'root.menuitems',
            parent: 'Production',
            endSection: false,
            roles: ['bronze', 'silver', 'gold', 'admin', 'superUser']
        });
        
    }]