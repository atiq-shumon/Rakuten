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
    var jsonObj = JSON.parse(xhr.responseText);

    for (var i = 0; i < Object.keys(jsonObj.children).length; i++) {
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
    //  console.log(Object.keys(jsonObj.children.child).length);
    //document.getElementById('demo').innerHTML = xhr.responseText;
}

function getProduct(xhr) {
    var jsonObj = JSON.parse(xhr.responseText);
    var col = '';

    for (var i = 0; i < Object.keys(jsonObj.Items).length; i++) {
        var obj = jsonObj.Items[i];
        for (var key in obj) {
            var value = obj[key].itemName;
            var imageUrl = obj[key].smallImageUrls[Object.keys(obj[key].smallImageUrls)[0]].imageUrl;
            col += '<div class="col-md-3"><a href="#" class="thumbnail"><img style="height:100px;width:100px" src=' + imageUrl.substring(0, imageUrl.lastIndexOf("?")) + ' alt="' + value + '"><p class=prodDesc>' + value + '</p></a></div>';
        }
    }

    document.getElementById('itemsRow').innerHTML = col;
}

function search(so, go) {
    if (so.value) {
        loadDoc('https://app.rakuten.co.jp/services/api/IchibaItem/Search/20140222?applicationId=1077580569659850281&keyword=' + so.value + '&sort=%2BitemPrice', getProduct);
    } else if (go.value) {
        loadDoc('https://app.rakuten.co.jp/services/api/IchibaItem/Search/20140222?applicationId=1077580569659850281&genreId=' + go.value + '&sort=%2BitemPrice', getProduct);
    }
}
// window.addEventListener("load", );

document.addEventListener('DOMContentLoaded', function() {
    var genereURL = 'https://app.rakuten.co.jp/services/api/IchibaGenre/Search/20120723?applicationId=1077580569659850281&genreId=0';
    loadDoc(genereURL, getProductCategory);
    var searchObj = document.getElementById("searchTxt");
    var genereObj = document.getElementById("ddl");
    var searchBtn = document.getElementById("btnSearch");
    searchBtn.addEventListener("click", function() { search(searchObj, genereObj) }, false);


}, false);
