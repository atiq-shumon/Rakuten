// jshint multistr:true

// using revealing module  pattern
// static class methods
var Utility = (function(_W, _D, _N, _L) {
    'use strict';
    //private scope
    var debug = true;
    return { // public scope

        isValidObj: function(o) {
            return (typeof o !== 'undefined' && typeof o === 'object') ? true : false;
        },
        getFirstProp: function(o) {
            for (var key in o) {
                return o[key];
            }
        },
        getImageUrl: function(o) {
            if (this.isValidObj(o)) {
                return this.isValidObj(this.getFirstProp(o)) ? this.getFirstProp(o).imageUrl : '';
            } else {
                return '';
            }

        },
        addEvent: function(node, type, handler) {
            if (node.addEventListener) {
                node.addEventListener(type, handler, false);
            } else {
                node.attachEvent("on" + type, handler);
            }
        },
        removeEvent: function(node, type, handler) {
            if (node.removeEventListener) {
                node.removeEventListener(type, handler, false);
            } else {
                node.detachEvent("on" + type, handler);
            }
        },
        removeChild: function(el) {
            if (!this.isValidObj(el)) return;
            while (el.firstChild) el.removeChild(el.firstChild);
            return;
        },
        addClass: function(classname, el) {
            if (!this.isValidObj(el)) return;
            var cn = el.className;
            //test for existance
            if (cn.indexOf(classname) !== -1) {
                return;
            }
            //add a space if the element already has class
            if (cn !== '') {
                classname = ' ' + classname;
            }
            el.className = cn + classname;
        },

        removeClass: function(classname, element) {
            if (!this.isValidObj(element)) return;
            var cn = element.className;
            var rxp = new RegExp("\\s?\\b" + classname + "\\b", "g");
            cn = cn.replace(rxp, '');
            element.className = cn;
        },
        loadDoc: function(url, cFunc) {
            _D.body.style.cursor = "progress";
            var xhr = new XMLHttpRequest();
            xhr.onreadystatechange = function() {
                if (xhr.readyState === 4 && xhr.status === 200) {

                    cFunc(xhr);
                    _D.body.style.cursor = "default";

                }
            };
            xhr.open('GET', url);
            xhr.send();
        },
        clearOptionsFast: function(selectObj) {
            if (selectObj) {
                // selectObj.length = 0;
                while (selectObj.options.length) {
                    selectObj.firstChild.remove(0);
                }
            }
        },
        logError: function(err) {
            if (debug) {
                console.log('error:' + err.message);
            }
        },
        isFoundInArray: function(arr, el) {
            if (arr && el.length) {
                for (var i = 0, len = arr.length; i < len; i++) {
                    if (arr[i].toUpperCase().indexOf(el.toUpperCase()) !== -1) {
                        return true;
                    }
                }
            }
            return false;
        }
    }; // end of public scope
})(window, document, navigator, location);
//// end of Utility

////// revealing prototype pattern
var AutoCompleter = function(nm, inputObj, btn, autoFillListObj) {
    'use strict';
    this.nm = nm;
    this.inputObj = inputObj;
    this.btn = btn;
    this.autoFillListObj = autoFillListObj;
};
AutoCompleter.prototype = function() {
    'use strict';
    //private member
    var isFound = function(nm, item) {
            var allEntries = JSON.parse(localStorage.getItem(nm));
            return Utility.isFoundInArray(allEntries, item);

        },
        addToAutoFill = function(autoFillListObj, items) {
            Utility.clearOptionsFast(autoFillListObj);
            for (var i = 0, len = items.length; i < len; i++) {

                var opt = document.createElement('option');
                opt.value = items[i];
                // opt.text = "laptop";
                autoFillListObj.appendChild(opt);

            }

        },
        addToLocalStorage = function(nm, item, autoFillListObj) {
            if (!isFound(nm, item) && item !== "") {
                var allEntries = JSON.parse(localStorage.getItem(nm)) || [];
                allEntries.push(item);
                localStorage.setItem(nm, JSON.stringify(allEntries));
                addToAutoFill(autoFillListObj, allEntries);
            }
        },
        init = function() {
            var self = this;
            var allEntries = JSON.parse(localStorage.getItem(this.nm)) || [];
            addToAutoFill(this.autoFillListObj, allEntries);
            Utility.addEvent(this.btn, 'click', function(e) { addToLocalStorage(self.nm, document.getElementById(self.inputObj.id).value, self.autoFillListObj) });

        },
        remove = function() {};

    return {
        init: init
    }
}();
//////end of Auto Completer

function getProductCategory(xhr) {
    var ddl = document.getElementById('ddl');
    if (Utility.isValidObj(ddl)) {
        var jsonObj = JSON.parse(xhr.responseText);

        for (var i = 0; i < jsonObj.children.length; i++) {
            var obj = jsonObj.children[i];
            for (var key in obj) {
                var ky = obj[key].genreId;
                var value = obj[key].genreName;
                var option = document.createElement('option');
                option.text = value;
                option.value = ky;
                ddl.add(option, 0);
            }

        }
    }

}

function getProductHTML(jsonObj) {
    var col = '';

    for (var i = 0, itemsPerPage = jsonObj.Items.length; i < itemsPerPage; i++) {
        var obj = jsonObj.Items[i];
        for (var key in obj) {
            var value = obj[key].itemName;
            var imageUrl = Utility.getImageUrl((obj[key].smallImageUrls)) !== '' ? Utility.getImageUrl((obj[key].smallImageUrls)) : '#';
            col += '<div class="col-md-3"><a href="#" class="thumbnail items"><img style="height:100px;width:100px" src=' + imageUrl.substring(0, imageUrl.lastIndexOf("?")) + ' alt="' + value + '"><p class=prodDesc>' + value + '</p></a></div>';
        }
    }
    return col;
}

function getProduct(xhr) {

    var jsonObj = JSON.parse(xhr.responseText);
    var itemCount = jsonObj.count,
        pageCount = jsonObj.pageCount,
        pageNumber = jsonObj.page;
    var searchObj = document.getElementById("searchTxt"),
        genereObj = document.getElementById("ddl"),
        itemsDiv = document.getElementById('itemsRow');

    itemsDiv.innerHTML = getProductHTML(jsonObj);
    //calling Pager class
    var itemObjs = document.getElementsByClassName('items');

    var pager = new Pager(searchObj, genereObj, itemCount, pageCount, 30, 'pager', itemsDiv);
}

function reloadProduct(xhr) {
    var jsonObj = JSON.parse(xhr.responseText);
    var itemsDiv = document.getElementById('itemsRow');
    itemsDiv.innerHTML = getProductHTML(jsonObj);

}

function getApiString(go, so, pg) {
    var apiString = '',
        commonPart = 'https://app.rakuten.co.jp/services/api/IchibaItem/Search/20140222?applicationId=1077580569659850281&';
    if (so.value !== '') {
        apiString = commonPart + 'keyword=' + so.value + '&genreId=' + go.value + '&page=' + pg + '&sort=%2BitemPrice';
    } else if (go.value !== '' && so.value === '') {
        apiString = commonPart + 'genreId=' + go.value + '&page=' + pg + '&sort=%2BitemPrice';
    }
    return apiString;

}

function search(so, go, pg) {
    var itemsRow = document.getElementById('itemsRow');
    if (Utility.isValidObj(itemsRow)) {
        itemsRow.innerHTML = '';
        var pager = document.getElementById('pager');
        if (pager) {
            pager.innerHTML = '';
        }
        Utility.loadDoc(getApiString(go, so, pg), getProduct);
    }
}

Utility.addEvent(document, 'DOMContentLoaded', function() {
    var genereURL = 'https://app.rakuten.co.jp/services/api/IchibaGenre/Search/20120723?applicationId=1077580569659850281&genreId=0';
    Utility.loadDoc(genereURL, getProductCategory);
    var searchObj = document.getElementById("searchTxt");
    var genereObj = document.getElementById("ddl");
    var searchBtn = document.getElementById("btnSearch");
    if (Utility.isValidObj(searchBtn) && Utility.isValidObj(genereObj) && Utility.isValidObj(searchObj)) {
        Utility.addEvent(searchBtn, "click", function() {
            search(searchObj, genereObj, 1);

        });
        var autoFillListObj = document.getElementById("productsAutoFill");
        var myAutoCompleter = new AutoCompleter('prods', searchObj, searchBtn, autoFillListObj);
        myAutoCompleter.init();
    }


});

Utility.addEvent(window, 'error', function(e) {
    Utility.logError(e);
    // best practice sending error to server for tracking
    // var stack = e.error.stack;
    // var message = e.error.toString();
    // if (stack) {
    //     message += '\n' + stack;
    // }
    // var xhr = new XMLHttpRequest();
    // xhr.open('POST', '/log', true);
    // xhr.send(message);
});
