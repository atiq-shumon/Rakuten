var utility = {
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

    }
}

function loadDoc(url, cFunc) {
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4 && xhr.status == 200) {
            cFunc(xhr);
        }
    }
    xhr.open('GET', url);
    xhr.send();
}

function getProductCategory(xhr) {
    var ddl = document.getElementById('ddl');
    if (utility.isValidObj(ddl)) {
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
    //  console.log(Object.keys(jsonObj.children.child).length);
    //document.getElementById('demo').innerHTML = xhr.responseText;
}

function getProduct(xhr) {
    var jsonObj = JSON.parse(xhr.responseText);
    var col = '';

    for (var i = 0; i < jsonObj.Items.length; i++) {
        var obj = jsonObj.Items[i];
        for (var key in obj) {
            var value = obj[key].itemName;
            var imageUrl = utility.getImageUrl((obj[key].smallImageUrls)) != '' ? utility.getImageUrl((obj[key].smallImageUrls)) : '#';
            col += '<div class="col-md-3"><a href="#" class="thumbnail items"><img style="height:100px;width:100px" src=' + imageUrl.substring(0, imageUrl.lastIndexOf("?")) + ' alt="' + value + '"><p class=prodDesc>' + value + '</p></a></div>';
        }
    }

    var itemsDiv = document.getElementById('itemsRow');
    itemsDiv.innerHTML = col;
    //calling Pager class
    var itemObjs = document.getElementsByClassName('items');
    var pager = new Pager(itemObjs, 5, 'pager');
    pager.showPage(1);

}

function search(so, go) {
    if (utility.isValidObj(document.getElementById('itemsRow'))) {
        document.getElementById('itemsRow').innerHTML = '';
        var pager = document.getElementById('pager');
        if (pager) {
            pager.innerHTML = '';
        }
        if (so.value != '') {
            // console.log('https://app.rakuten.co.jp/services/api/IchibaItem/Search/20140222?applicationId=1077580569659850281&keyword=' + so.value + '& genreId=' + go.value + '&sort=%2BitemPrice');
            loadDoc('https://app.rakuten.co.jp/services/api/IchibaItem/Search/20140222?applicationId=1077580569659850281&keyword=' + so.value + '&genreId=' + go.value + '&sort=%2BitemPrice', getProduct);
        } else if (go.value != '' && so.value == '') {
            loadDoc('https://app.rakuten.co.jp/services/api/IchibaItem/Search/20140222?applicationId=1077580569659850281&genreId=' + go.value + '&sort=%2BitemPrice', getProduct);
        }


    }


}
// window.addEventListener("load", );

document.addEventListener('DOMContentLoaded', function() {
    var genereURL = 'https://app.rakuten.co.jp/services/api/IchibaGenre/Search/20120723?applicationId=1077580569659850281&genreId=0';
    loadDoc(genereURL, getProductCategory);
    var searchObj = document.getElementById("searchTxt");
    var genereObj = document.getElementById("ddl");
    var searchBtn = document.getElementById("btnSearch");
    if (utility.isValidObj(searchBtn) && utility.isValidObj(genereObj) && utility.isValidObj(searchObj)) {
        searchBtn.addEventListener("click", function() { search(searchObj, genereObj) }, false);
    }

}, false);
