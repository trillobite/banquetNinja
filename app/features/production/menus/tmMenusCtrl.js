
import ninjaSchemas from 'ninjaSchemas';

class tmMenusCtrl {
    constructor($scope, tmListFactory) {

        var constructorArgs = {
            schema: ninjaSchemas.production.Menu,
            model: 'Menu',
            listView: 'root.menus',
            detailView: 'root.menuDetail',
            addHeaderText: 'Add Menu',
            listTitle: 'Menus'
        };

        this.activeFilter = "A";

        this.activeMenus = [];

        let alphaSorted = {"A": [], "B": [], "C": [], "D": [], "E": [], "F": [], "G": [], "H": [], "I": [], "J": [], "K": [], "L": [], "M": [], "N": [], "O": [], "P": [], "Q": [], "R": [], "S": [], "T": [], "U": [], "V": [], "W": [], "X": [], "Y": [], "Z": []};

        console.log("tmMenusCtrl this:", this);

        this.stripNums = (menuObj) => {
            let nwName = "";
            if (menuObj.hasOwnProperty("name")) {
                let name = menuObj.name;
                for (let i = 0; i < name.length; ++i) {
                    if (isNaN(name[i])) {
                        nwName += name[i];
                    }
                }
                console.log(nwName);
            } else {
                console.log("NO NAME PROPERTY!!!", menuObj);
            }
            return nwName;
        };

        this.getFilterChar = (nwName) => {
            let alphabet = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"];
            let str = nwName.toUpperCase();
            let char = str[0];
            if (alphabet.indexOf(char) > -1) {
                return char;
            }

            return "A";
        };


        this.changeFilter = function (value) {
            this.activeFilter = value.value;
            this.activeMenus = alphaSorted[this.activeFilter];

            // we need to hide and show objects, based on alphabetical.



            // var filter = {
            //     select: "firstName lastName phoneNumbers",
            //     "startsWith[lastName]": value.value,
            //     "sort[lastName]": 1
            // };
            // this.loadData(filter, true);
        };

        this.__proto__ = tmListFactory(constructorArgs);

        //loadData needs to be async or return a promise.
        this.loadData().then((tmp) => {
            console.log("loadData result:", tmp);

            //this.items.reverse() //comes in from db oldest first...

            this.items.map((obj) => {
                obj.nwName = this.stripNums(obj);
                obj.filterChar = this.getFilterChar(obj.nwName);
                console.log("filterChar:", obj.filterChar);
                alphaSorted[obj.filterChar].push(obj);
            });

            this.activeMenus = alphaSorted[this.activeFilter]; //Usually "A".

            // this.menus = this.items; //this is to help angular bindings...
        });

    }

}

tmMenusCtrl.$inject = ['$scope', 'tmListFactory'];

export default tmMenusCtrl;