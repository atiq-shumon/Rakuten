function Pager(items, itemsPerPage, pagerId) {
    this.itemsPerPage = itemsPerPage;
    this.currentPage = 1;
    this.pages = Math.ceil(items.length / itemsPerPage);
    this.initiated = false;
    this.itemCount = items.length;
    this.items = items;
    this.pagerId = pagerId;
    var self = this;
    this.addPager = function() {
        this.items[0].parentNode.parentNode.insertAdjacentHTML('afterend', '<div class="row row-centered" id=' + this.pagerId + '></div>');
    };
    this.showItems = function(from, to) {
        for (var i = 0; i < this.itemCount; i++) {
            if (i < from || i > to) {
                items[i].style.display = 'none';
            } else {
                items[i].style.display = '';
            }
        }
    };

    this.showPage = function(pageNumber) {

        var oldPageAnchor = document.getElementById('pg' + this.currentPage);
        if (oldPageAnchor)
            oldPageAnchor.className = 'pg-normal';

        this.currentPage = pageNumber;
        var newPageAnchor = document.getElementById('pg' + this.currentPage);
        if (newPageAnchor)
            newPageAnchor.className = 'pg-selected';

        var from = (pageNumber - 1) * itemsPerPage;
        var to = from + this.itemsPerPage - 1;
        this.showItems(from, to);
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
        var pager = document.getElementById(this.pagerId);
        if (!pager) {
            self.addPager();
            var pager = document.getElementById(this.pagerId);
        }

        var pagerHtml = '<span class="pg-normal" id="' + this.pagerId + 'prev">&#171 Prev</span>';
        for (var page = 1; page <= this.pages; page++) {
            pagerHtml += '<span id="pg' + page + '" class="pg-normal pg-count">' + page + '</span>';
        }
        pagerHtml += '<span class="pg-normal" id="' + this.pagerId + 'next"> Next &#187</span>';
        pager.innerHTML = '<div class="col-centered  ">' + pagerHtml + '</div>';
        var prev = document.getElementById(this.pagerId + "prev");
        prev.addEventListener("click", function() {
            self.prev();
        }, false);
        var next = document.getElementById(this.pagerId + "next");
        next.addEventListener("click", function() {
            self.next();
        }, false);


        var pageNumbers = document.getElementsByClassName('pg-count');
        var pages = pageNumbers.length;
        for (var i = 0; i < pages; i++) {

            pageNumbers[i].addEventListener("click", function() {
                self.showPage(this.innerHTML);
            }, false);

        }
    }
}
