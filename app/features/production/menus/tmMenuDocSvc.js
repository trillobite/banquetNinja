import ninjaSchemas from 'ninjaSchemas';
import angular from 'angular';
import config from 'config';

function tmMenuDocSvc(tmDocFactory, tmIdentity, $dataSource) {

    this.__proto__ = tmDocFactory('Menu', ninjaSchemas.production.Menu);

    console.log("__proto__:", this.__proto__);

    this.doc.sections = this.doc["sections"] ? this.doc.sections : [];
    // this.doc.sections.map((item) => {
    //     item.visible = true;
    // });

    this.activeObj = {
        visible: 0,
        index: 0
    };

    this.categories = [];

    this.addableMenuItems = [];

    this.selCategory = "";

    let self = this;

    this.getCategories = () => {
        let dfd = new Promise((resolve, reject) => {

            let mylookups = this.$dataSource.load("Lookups");

            console.log("mylookups:", mylookups);

            try {
                mylookups.query().then((data) => {
                    console.log("data:", data);
                    resolve(data.menuItemTags);
                });
                // mylookups.getOne(tmIdentity.currentUser.user.company, true).then((data) => {
                //     console.log("data:", data);
                //     resolve(data.menuItemTags);
                // });

            } catch (e) {
                // reject(e);
                console.log(e);
            }

        });

        return dfd;
    };

    // title, subtitle, items, footer
    this.addSection = function (section) {
        var newSection = {
            title: "Section Title",
            subtitle: "Section subtitle",
            items: [],
            footer: "section footer",
            //visible: true
        }
        this.doc.sections.push(newSection);
    };

    this.addItem = (item) => {
        console.log("add this:", item);
    };

    let getDateLastYear = () => {
        let now = new Date();
        now.setFullYear(now.getFullYear() - 1);
        return now;
    };

    this.runSearch = () => {

        let url = `${config.apiBase}/production/menuitems?where[categories]=${[this.selCategory]}`;
        let request = {
            method: "GET",
            url: url
        };

        let filtered = [];
        this.$http(request).then((data) => {
            data.data.data.map((menItm) => {
                let dt = new Date(menItm.meta.dateLastMod);
                if (dt.getTime() >= (getDateLastYear().getTime())) {
                    filtered.push(menItm);
                }
            });
            console.log("menuItems:", filtered);
            self.addableMenuItems = filtered;
        });

    };

    this.editSection = (index) => {
        let doc = this.doc.sections[index];
        console.log("editSection", index, doc);
        //doc.visible = false;
        this.activeObj.visible = 1;
        this.activeObj.index = index;
    };

    this.setActiveTab = (index) => {
        this.activeObj.visible = index;
    };

    this.openAddFood = () => {
        this.getCategories().then((data) => {
            console.log("openAddFood data:", data);
            self.categories = data;
        });

        this.setActiveTab(2);
    };

    this.openEditSection = () => {
        // this.getCategories();
        this.setActiveTab(1);
    };

    this.removeSection = function (index) {
        this.doc.sections.splice(index, 1);
    };

    this.updateSection = function (section) { };

    this.addMenuItem = function (section, menuItem) { };

    this.removeMenuItem = function (section, menuItem) { };

    this.updateMenuItem = function (section, menuItem) { };


    return this;

}


tmMenuDocSvc.$inject = ['tmDocFactory', "tmIdentity", "$dataSource"];

export default tmMenuDocSvc;