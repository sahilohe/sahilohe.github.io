(function () {
  "use strict";

  var root = document.documentElement;
  var toggle = document.getElementById("theme-toggle");
  if (!toggle) return;

  var dark = toggle.querySelector(".dark");
  var light = toggle.querySelector(".light");

  function update(theme) {
    if (dark) dark.classList.toggle("active", theme === "dark");
    if (light) light.classList.toggle("active", theme === "light");
  }

  update(root.getAttribute("data-theme") || "dark");

  toggle.addEventListener("click", function () {
    var current = root.getAttribute("data-theme") || "dark";
    var next = current === "dark" ? "light" : "dark";
    root.setAttribute("data-theme", next);
    update(next);
    try {
      localStorage.setItem("theme", next);
    } catch (err) {
      void err;
    }
  });
})();
