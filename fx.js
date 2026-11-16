// fx.js - "Cyber Aurora" motion: aurora, pointer grid, progress, nav spy, 3D tilt, magnet, reveal.
(function () {
  "use strict";

  var calm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  // Light behind everything, a grid lit under the pointer, and the scroll hairline.
  var aurora = document.createElement("div");
  aurora.className = "fx-aurora";
  aurora.setAttribute("aria-hidden", "true");
  aurora.innerHTML = "<i></i><i></i><i></i>";
  var spot = document.createElement("div");
  spot.className = "fx-spot";
  spot.setAttribute("aria-hidden", "true");
  var bar = document.createElement("div");
  bar.className = "fx-progress";
  bar.setAttribute("aria-hidden", "true");
  document.body.prepend(bar);
  document.body.prepend(spot);
  document.body.prepend(aurora);

  if (fine && !calm) {
    window.addEventListener("pointermove", function (e) {
      spot.style.setProperty("--x", e.clientX + "px");
      spot.style.setProperty("--y", e.clientY + "px");
    }, { passive: true });
  } else {
    spot.style.display = "none";
  }

  var ticking = false;
  function onScroll() {
    ticking = false;
    var max = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.transform = "scaleX(" + (max > 0 ? Math.min(1, window.scrollY / max) : 0) + ")";
  }
  window.addEventListener("scroll", function () {
    if (!ticking) { ticking = true; requestAnimationFrame(onScroll); }
  }, { passive: true });
  onScroll();

  // The nav marks the section in view.
  var links = Array.prototype.slice.call(document.querySelectorAll(".nav-links a[href^='#']"));
  if ("IntersectionObserver" in window && links.length) {
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        links.forEach(function (a) { a.classList.toggle("fx-current", a.getAttribute("href") === "#" + e.target.id); });
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    links.forEach(function (a) {
      var t = document.querySelector(a.getAttribute("href"));
      if (t) spy.observe(t);
    });
  }

  // Cards become glass with a spotlight; the ones that stay put also tilt in 3D.
  var cards = document.querySelectorAll(".project-card, .article-card, .skill-card, .gh-card, .gh-stat, .contact-card-item");
  cards.forEach(function (card) {
    card.classList.add("fx-card");
    if (!card.querySelector(".fx-glare")) {
      var g = document.createElement("span");
      g.className = "fx-glare";
      g.setAttribute("aria-hidden", "true");
      card.appendChild(g);
    }
  });
  if (fine && !calm) {
    // Moving carousel cards keep the spotlight only; the clones are delegated.
    document.addEventListener("pointermove", function (e) {
      var card = e.target.closest && e.target.closest(".fx-card");
      if (!card) return;
      var r = card.getBoundingClientRect();
      var x = (e.clientX - r.left) / r.width;
      var y = (e.clientY - r.top) / r.height;
      card.style.setProperty("--mx", (x * 100).toFixed(1) + "%");
      card.style.setProperty("--my", (y * 100).toFixed(1) + "%");
      if (card.classList.contains("marquee-card")) return;
      card.style.transition = "transform 0.12s ease-out";
      card.style.transform = "perspective(1000px) rotateX(" + ((0.5 - y) * 6).toFixed(2) + "deg) rotateY(" + ((x - 0.5) * 8).toFixed(2) + "deg) translateY(-3px)";
    }, { passive: true });
    cards.forEach(function (card) {
      card.addEventListener("pointerleave", function () {
        if (card.classList.contains("marquee-card")) return;
        card.style.transition = "transform 0.7s cubic-bezier(0.34, 1.36, 0.64, 1)";
        card.style.transform = "";
      });
    });

    // The terminal tilts gently toward the pointer.
    var term = document.querySelector(".terminal-window");
    var hero = document.querySelector(".hero");
    if (term && hero) {
      hero.addEventListener("pointermove", function (e) {
        var r = hero.getBoundingClientRect();
        var x = (e.clientX - r.left) / r.width - 0.5;
        var y = (e.clientY - r.top) / r.height - 0.5;
        term.style.transform = "perspective(1200px) rotateY(" + (x * 10).toFixed(2) + "deg) rotateX(" + (-y * 8).toFixed(2) + "deg)";
      });
      hero.addEventListener("pointerleave", function () { term.style.transform = ""; });
      term.style.transition = "transform 0.6s cubic-bezier(0.22, 1, 0.36, 1)";
    }

    // Buttons lean toward the pointer.
    document.querySelectorAll(".btn, .social-icon-btn").forEach(function (b) {
      b.addEventListener("pointermove", function (e) {
        var r = b.getBoundingClientRect();
        b.style.transform = "translate(" + ((e.clientX - r.left - r.width / 2) * 0.18).toFixed(1) + "px," + ((e.clientY - r.top - r.height / 2) * 0.28).toFixed(1) + "px)";
      });
      b.addEventListener("pointerleave", function () { b.style.transform = ""; });
    });
  }

  // Headers draw their rule, cards wipe up one after another as they arrive.
  var heads = document.querySelectorAll(".section-header");
  // script.js already reveals the skill, project, article and contact cards: give theirs a spring.
  if (!calm) {
    document.querySelectorAll(".skill-card, .project-card:not(.marquee-card), .article-card, .contact-card-item").forEach(function (el) {
      if (el.style.opacity !== "0") return;
      var d = (el.style.transition.match(/ease ([\d.]+)s/) || [0, "0"])[1];
      el.style.transition = "opacity 0.7s cubic-bezier(0.22, 1, 0.36, 1) " + d + "s, transform 0.9s cubic-bezier(0.34, 1.36, 0.64, 1) " + d + "s";
      el.style.transform = "translateY(36px) scale(0.97)";
    });
  }
  // The GitHub cards have no reveal of their own: they wipe up.
  var reveal = document.querySelectorAll(".gh-card, .gh-stat");
  if (calm || !("IntersectionObserver" in window)) {
    heads.forEach(function (h) { h.classList.add("fx-in"); });
    return;
  }
  reveal.forEach(function (el) {
    var siblings = Array.prototype.indexOf.call(el.parentNode.children, el);
    el.style.setProperty("--i", siblings % 4);
    el.classList.add("fx-reveal");
  });
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) { e.target.classList.add("fx-in"); io.unobserve(e.target); }
    });
  }, { rootMargin: "0px 0px -8% 0px" });
  heads.forEach(function (h) { io.observe(h); });
  reveal.forEach(function (el) { io.observe(el); });
})();
