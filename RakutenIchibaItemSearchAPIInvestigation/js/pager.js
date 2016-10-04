function Pager(searchObj, genereObj, itemsCount, pageCount, itemsPerPage, pagerId, container) {
    this.itemsPerPage = itemsPerPage;
    this.currentPage = 1;
    this.pages = pageCount;
    this.initiated = false;
    this.itemCount = itemsCount;
    this.container = container;
    this.searchObj = searchObj;
    this.genereObj = genereObj;
    this.pagerId = pagerId;
    var self = this;
    this.getPager = function(pagerID) {
        var pager = document.getElementById(this.pagerId);
        if (!pager) {
            this.container.insertAdjacentHTML('afterend', '<div class="row row-centered" id=' + pagerID + '></div>');
        }
        return document.getElementById(this.pagerId);
    }
    this.pagination = function(c, m) {
        var current = c,
            last = m,
            delta = 2,
            left = current - delta,
            right = +current + +delta + 5,
            range = [],
            rangeWithDots = [],
            l;

        for (let i = 1; i <= last; i++) {
            if (i === 1 || i === last || i >= left && i < right) {
                range.push(i);
            }
        }

        for (let i of range) {
            if (l) {
                if (i - l === 2) {
                    rangeWithDots.push('<span  class="pg-normal pg-count">' + l + 1 + '</span>');
                } else if (i - l !== 1) {
                    rangeWithDots.push('<span  class="pg-normal">' + '...' + '</span>');
                }
            }
            rangeWithDots.push('<span  class="pg-normal pg-count">' + i + '</span>');
            l = i;
        }

        return rangeWithDots.join(" ");
    };

    this.AttachClickEventToPages = function(curPage) {
        var pageNumbers = document.getElementsByClassName('pg-count');
        var pages = pageNumbers.length;
        for (var i = 0; i < pages; i++) {
            if (pageNumbers[i].innerHTML === curPage.toString()) {
                Utility
.addClass('pg-selected', pageNumbers[i]);
            }
            Utility.addEvent(pageNumbers[i], "click", function() { self.showPage(this.innerHTML) });

        }

    };

    this.showPage = function(pageNumber) {

        this.currentPage = pageNumber;
        Utility.loadDoc(getApiString(this.genereObj, this.searchObj, pageNumber), reloadProduct);
        Utility.removeChild(document.querySelectorAll('.pg-count'));

        document.querySelector("#pg-numbers").innerHTML = this.pagination(this.currentPage, this.pages);
        this.AttachClickEventToPages(this.currentPage);

    };
    this.prev = function() {
        if (this.currentPage > 1) {
            this.showPage(this.currentPage - 1);
        }
    };
    this.next = function() {
        if (this.currentPage < this.pages) {
            this.showPage(+this.currentPage + +1);
        }
    };
    if (this.pages > 1) {
        var pager = this.getPager(this.pagerId); // create and return pager object
        var pagerHtml = '<span class="pg-normal" id="' + this.pagerId + 'prev">&#171 Prev</span>';
        pagerHtml += '<span id="pg-numbers">';
        pagerHtml += this.pagination(this.currentPage, this.pages);
        pagerHtml += '</span>';
        pagerHtml += '<span class="pg-normal" id="' + this.pagerId + 'next"> Next &#187</span>';

        pager.innerHTML = '<div class="col-centered  ">' + pagerHtml + '</div>';

        this.AttachClickEventToPages(1);
        var prev = document.getElementById(this.pagerId + "prev");
        Utility.addEvent(prev, "click", function() {
            self.prev();
        });

        var next = document.getElementById(this.pagerId + "next");
        Utility.addEvent(next, "click", function() {
            self.next();
        });


    }
}
