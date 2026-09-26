(function () {
  "use strict";

  var main = document.getElementById("library-main");
  if (!main) return;

  var empty = document.getElementById("library-empty");
  var gridBtn = document.getElementById("view-grid");
  var listBtn = document.getElementById("view-list");
  var countEl = document.getElementById("library-count");

  var FEATURED = [
    "Gödel, Escher, Bach",
    "I Am a Strange Loop",
    "The Beginning of Infinity",
    "Fabric of Reality",
    "The Selfish Gene",
    "New Kind of Science",
    "The Anthology of Balaji",
    "From Third World to First"
  ];

  var CATEGORY_ORDER = [
    "Mathematics",
    "Physics & Astronomy",
    "Science & Nature",
    "Computing & Technology",
    "Philosophy",
    "History, Politics & Society",
    "Law, Constitution & Polity",
    "Business, Money & Economics",
    "Language & Reference",
    "Art, Design & Culture",
    "Wellbeing & Eastern Wisdom",
    "Biography & Memoir",
    "Chess",
    "Fiction",
    "Psychology & Self-Help"
  ];

  var BOOKS = [];
  var view = "grid";
  var observer = null;

  function esc(value) {
    return String(value == null ? "" : value).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  function fixName(name) {
    return /[A-Z]/.test(name)
      ? name
      : name.replace(/\b\w/g, function (c) {
          return c.toUpperCase();
        });
  }

  function authorLine(book) {
    if (!book.authors || !book.authors.length) return "Author unknown";
    return fixName(book.authors[0]);
  }

  function cardHTML(book) {
    var face = book.cover
      ? '<img class="book-cover" src="' + esc(book.cover) + '" alt="" loading="lazy" decoding="async">'
      : '<div class="book-ph" style="--c1:' + esc(book.acc) + ";--c2:" + esc(book.acc2) + '"><span>' +
        esc(book.title) + "</span></div>";
    return (
      '<div class="book" data-title="' + esc(book.title) + '">' +
      '<span class="book-frame">' + face + "</span>" +
      '<span class="book-title">' + esc(book.title) + "</span>" +
      '<span class="book-author">' + esc(authorLine(book)) + "</span>" +
      "</div>"
    );
  }

  function rowHTML(book) {
    var face = book.cover
      ? '<img class="book-thumb" src="' + esc(book.cover) + '" alt="" loading="lazy" decoding="async">'
      : '<span class="book-thumb ph" style="--c1:' + esc(book.acc) + ";--c2:" + esc(book.acc2) + '"></span>';
    return (
      '<li class="book-row" data-title="' + esc(book.title) + '">' +
      face +
      '<span class="row-title">' + esc(book.title) + "</span>" +
      '<span class="row-author">' + esc(authorLine(book)) + "</span>" +
      "</li>"
    );
  }

  function itemsHTML(items) {
    if (view === "list") {
      return '<ul class="book-list two-col">' + items.map(rowHTML).join("") + "</ul>";
    }
    return '<div class="book-grid">' + items.map(cardHTML).join("") + "</div>";
  }

  function reduceMotion() {
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }

  function reveal() {
    var cards = Array.prototype.slice.call(main.querySelectorAll(".book, .book-row"));
    if (reduceMotion()) {
      cards.forEach(function (card) {
        card.classList.add("in");
      });
      return;
    }
    if (observer) observer.disconnect();
    observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("in");
            observer.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "0px 0px 10% 0px", threshold: 0.01 }
    );
    cards.forEach(function (card, i) {
      card.style.transitionDelay = Math.min(i, 8) * 18 + "ms";
      observer.observe(card);
    });
  }

  function byTitle(a, b) {
    return a.title.localeCompare(b.title);
  }

  function normTitle(value) {
    return String(value).toLowerCase().trim();
  }

  function shelfHTML(name, items, featured) {
    var label = items.length + (items.length === 1 ? " book" : " books");
    return (
      '<section class="shelf' + (featured ? " featured" : "") + '">' +
      '<div class="shelf-head"><h2>' + esc(name) + "</h2>" +
      '<span class="shelf-count">' + label + "</span></div>" +
      itemsHTML(items) +
      "</section>"
    );
  }

  function featuredBooks() {
    return FEATURED.map(function (title) {
      var target = normTitle(title);
      return BOOKS.filter(function (book) {
        return normTitle(book.title) === target;
      })[0];
    }).filter(Boolean);
  }

  function render() {
    var featured = featuredBooks();
    var featuredTitles = {};
    featured.forEach(function (book) {
      featuredTitles[normTitle(book.title)] = true;
    });

    var groups = {};
    BOOKS.forEach(function (book) {
      if (featuredTitles[normTitle(book.title)]) return;
      var category = book.cat || "Other";
      (groups[category] || (groups[category] = [])).push(book);
    });

    var categories = Object.keys(groups)
      .filter(function (category) {
        return groups[category].length;
      })
      .sort(function (a, b) {
        var ia = CATEGORY_ORDER.indexOf(a);
        var ib = CATEGORY_ORDER.indexOf(b);
        if (ia === -1) ia = CATEGORY_ORDER.length;
        if (ib === -1) ib = CATEGORY_ORDER.length;
        return ia !== ib ? ia - ib : a.localeCompare(b);
      });

    var html = "";
    if (featured.length) html += shelfHTML("My Favourites and Must-Read Books", featured, true);
    categories.forEach(function (category) {
      html += shelfHTML(category, groups[category].slice().sort(byTitle), false);
    });

    main.innerHTML = html;
    if (empty) empty.hidden = BOOKS.length > 0;
    if (countEl) {
      countEl.textContent = BOOKS.length + (BOOKS.length === 1 ? " book" : " books");
    }
    reveal();
  }

  function setView(next) {
    view = next;
    if (gridBtn) gridBtn.setAttribute("aria-pressed", String(view === "grid"));
    if (listBtn) listBtn.setAttribute("aria-pressed", String(view === "list"));
    render();
  }

  if (gridBtn) gridBtn.addEventListener("click", function () { setView("grid"); });
  if (listBtn) listBtn.addEventListener("click", function () { setView("list"); });

  main.innerHTML = '<p class="library-empty">Loading the shelves\u2026</p>';

  fetch("data/books.json")
    .then(function (response) {
      if (!response.ok) throw new Error(response.status);
      return response.json();
    })
    .then(function (books) {
      BOOKS = books;
      render();
    })
    .catch(function () {
      main.innerHTML =
        '<p class="library-empty">Could not load <code>data/books.json</code>.<br>' +
        "Serve this folder over HTTP (e.g. <code>python3 -m http.server</code>) rather than opening the file directly.</p>";
    });
})();
