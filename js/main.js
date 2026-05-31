(function () {
  "use strict";

  /* Sticky header */
  function initHeader() {
    const header = document.querySelector(".site-header");
    if (!header) return;

    function updateHeader() {
      header.classList.toggle("scrolled", window.scrollY > 40);
    }

    updateHeader();
    window.addEventListener("scroll", updateHeader, { passive: true });
  }

  /* Mobile menu */
  function initMobileMenu() {
    const toggle = document.querySelector(".menu-toggle");
    const menu = document.querySelector(".mobile-menu");
    const closeBtn = document.querySelector(".mobile-menu-close");
    if (!toggle || !menu) return;

    function openMenu() {
      menu.classList.add("open");
      document.body.style.overflow = "hidden";
    }

    function closeMenu() {
      menu.classList.remove("open");
      document.body.style.overflow = "";
    }

    toggle.addEventListener("click", openMenu);
    closeBtn?.addEventListener("click", closeMenu);
    menu.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", closeMenu);
    });
  }

  /* Services carousel */
  function initCarousel() {
    const track = document.querySelector(".services-track");
    const prev = document.querySelector(".carousel-prev");
    const next = document.querySelector(".carousel-next");
    if (!track) return;

    const scrollAmount = 340;

    prev?.addEventListener("click", function () {
      track.scrollBy({ left: -scrollAmount, behavior: "smooth" });
    });

    next?.addEventListener("click", function () {
      track.scrollBy({ left: scrollAmount, behavior: "smooth" });
    });
  }

  /* FAQ accordion */
  function initAccordion() {
    document.querySelectorAll(".accordion-item").forEach(function (item) {
      const trigger = item.querySelector(".accordion-trigger");
      const panel = item.querySelector(".accordion-panel");
      if (!trigger || !panel) return;

      trigger.addEventListener("click", function () {
        const isOpen = item.classList.contains("open");

        document.querySelectorAll(".accordion-item.open").forEach(function (openItem) {
          openItem.classList.remove("open");
          const openPanel = openItem.querySelector(".accordion-panel");
          if (openPanel) openPanel.style.maxHeight = "0";
        });

        if (!isOpen) {
          item.classList.add("open");
          panel.style.maxHeight = panel.scrollHeight + "px";
        }
      });
    });
  }

  /* Quote form */
  function initForm() {
    document.querySelectorAll(".quote-form").forEach(function (form) {
      form.addEventListener("submit", function (event) {
        event.preventDefault();
        const data = new FormData(form);
        const name = data.get("name");
        const phone = data.get("phone");
        const email = data.get("email");
        const service = data.get("service");
        const address = data.get("address");
        const message = data.get("message");
        const subject = encodeURIComponent("Free Painting Quote Request");
        let bodyText = "Name: " + name + "\nPhone: " + phone + "\nEmail: " + email;
        if (service) bodyText += "\nProject type: " + service;
        if (address) bodyText += "\nAddress: " + address;
        bodyText += "\n\n" + message;
        const body = encodeURIComponent(bodyText);
        window.location.href = "mailto:info@remingtonpaintingomaha.com?subject=" + subject + "&body=" + body;
      });
    });
  }

  /* Duplicate marquee & gallery rows for seamless loop */
  function duplicateChildren(selector) {
    document.querySelectorAll(selector).forEach(function (el) {
      el.innerHTML += el.innerHTML;
    });
  }

  /* Satisfaction counter */
  function initSatisfactionCounter() {
    document.querySelectorAll(".reviews-satisfaction-counter").forEach(function (el) {
      const target = parseInt(el.getAttribute("data-target") || "99", 10);
      const start = parseInt(el.getAttribute("data-start") || "10", 10);
      let animated = false;

      const observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting || animated) return;
          animated = true;
          observer.disconnect();

          const duration = 1800;
          const startTime = performance.now();

          function tick(now) {
            const progress = Math.min((now - startTime) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            const value = Math.round(start + (target - start) * eased);
            el.textContent = String(value);
            if (progress < 1) requestAnimationFrame(tick);
          }

          requestAnimationFrame(tick);
        });
      }, { threshold: 0.4 });

      observer.observe(el.closest(".testimonials") || el.closest(".contact-reviews") || el);
    });
  }

  /* Review cards scroll-in */
  function initReviewCards() {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    document.querySelectorAll(".reviews-grid").forEach(function (grid) {
      if (!grid.querySelector(".review-card")) return;

      grid.classList.add("reviews-grid--animate");

      if (prefersReduced) {
        grid.classList.add("is-visible");
        return;
      }

      const observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          grid.classList.add("is-visible");
          observer.disconnect();
        });
      }, { threshold: 0.15, rootMargin: "0px 0px -32px 0px" });

      observer.observe(grid);
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    initHeader();
    initMobileMenu();
    initCarousel();
    initAccordion();
    initForm();
    initSatisfactionCounter();
    initReviewCards();
    duplicateChildren(".marquee-track");
    document.querySelectorAll(".gallery-row").forEach(function (row) {
      row.innerHTML += row.innerHTML;
    });
  });
})();
