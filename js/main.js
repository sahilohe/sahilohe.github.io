(function () {
  "use strict";

  var data = window.SITE_DATA || {};

  function esc(value) {
    return String(value == null ? "" : value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function renderFocus() {
    var host = document.getElementById("focus-list");
    if (!host) return;
    host.innerHTML = (data.focus || [])
      .map(function (item) {
        return "<li>" + esc(item) + "</li>";
      })
      .join("");
  }

  function renderExperience() {
    var host = document.getElementById("experience-list");
    if (!host) return;
    host.innerHTML = (data.experience || [])
      .map(function (job) {
        var points = (job.points || [])
          .map(function (point) {
            return "<li>" + esc(point) + "</li>";
          })
          .join("");
        var meta = [job.location, job.period].filter(Boolean).join(" · ");
        return (
          '<article class="job">' +
          '<div class="job-head">' +
          "<h3>" + esc(job.role) + "</h3>" +
          '<span class="job-period">' + esc(meta) + "</span>" +
          "</div>" +
          '<p class="job-org">' + esc(job.org) + "</p>" +
          '<ul class="job-points">' + points + "</ul>" +
          "</article>"
        );
      })
      .join("");
  }

  function renderCertifications() {
    var host = document.getElementById("certifications-list");
    if (!host) return;
    host.innerHTML = (data.certifications || [])
      .map(function (cert) {
        return "<li>" + esc(cert) + "</li>";
      })
      .join("");
  }

  function renderSkills() {
    var host = document.getElementById("skill-grid");
    if (!host) return;
    host.innerHTML = (data.skills || [])
      .map(function (group) {
        var items = (group.items || [])
          .map(function (item) {
            return "<li>" + esc(item) + "</li>";
          })
          .join("");
        return (
          '<div class="skill-group">' +
          '<p class="skill-category-label">' + esc(group.category) + "</p>" +
          '<ul class="chip-list">' + items + "</ul>" +
          "</div>"
        );
      })
      .join("");
  }

  function renderNotes() {
    var host = document.getElementById("note-grid");
    if (!host) return;
    host.innerHTML = (data.notes || [])
      .map(function (note) {
        return (
          "<details>" +
          "<summary><h3>" + esc(note.title) + "</h3></summary>" +
          '<div class="collapsible-content">' + esc(note.summary) + "</div>" +
          "</details>"
        );
      })
      .join("");
  }

  function renderProjects() {
    var host = document.getElementById("project-list");
    if (!host) return;
    host.innerHTML = (data.projects || [])
      .map(function (project) {
        var meta = [project.category, project.status, project.year]
          .filter(Boolean)
          .map(esc)
          .join(" &middot; ");

        var title = project.link
          ? '<a href="' + esc(project.link) + '" target="_blank" rel="noopener">' + esc(project.title) + "</a>"
          : esc(project.title);

        return (
          '<article class="project">' +
          "<h3>" + title + "</h3>" +
          '<p class="project-meta">' + meta + "</p>" +
          "<p>" + esc(project.summary) + "</p>" +
          "</article>"
        );
      })
      .join("");
  }

  function setYear() {
    var year = document.getElementById("year");
    if (year) year.textContent = new Date().getFullYear();
  }

  document.addEventListener("DOMContentLoaded", function () {
    renderFocus();
    renderExperience();
    renderCertifications();
    renderSkills();
    renderNotes();
    renderProjects();
    setYear();
  });
})();
