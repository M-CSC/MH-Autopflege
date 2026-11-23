/* MH Autopflege – Interaktionen (ohne Abhängigkeiten, CSP-konform). */
document.addEventListener("DOMContentLoaded", () => {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const saveData = Boolean(navigator.connection && navigator.connection.saveData);

  /* ---------- Header: Hintergrund ab Scrollbeginn ---------- */
  const header = document.querySelector(".site-header");
  if (header && !header.classList.contains("is-scrolled")) {
    const onScroll = () => header.classList.toggle("is-scrolled", window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  /* ---------- Mobile Navigation ---------- */
  const toggle = document.querySelector(".nav-toggle");
  if (header && toggle) {
    const label = toggle.querySelector(".nav-toggle__label");
    const setOpen = (open) => {
      header.classList.toggle("is-open", open);
      toggle.setAttribute("aria-expanded", String(open));
      if (label) label.textContent = open ? "Schließen" : "Menü";
    };
    toggle.addEventListener("click", () => setOpen(!header.classList.contains("is-open")));
    header.querySelectorAll(".nav a").forEach((a) => a.addEventListener("click", () => setOpen(false)));
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && header.classList.contains("is-open")) {
        setOpen(false);
        toggle.focus();
      }
    });
  }

  /* ---------- Fehlende Bilder: Platzhalter statt kaputtem Bild ---------- */
  // Nur echte Ladefehler werten. Lazy-Bilder nicht über img.complete prüfen:
  // Safari meldet complete=true, solange ein Lazy-Bild noch gar nicht geladen wurde.
  document.querySelectorAll(".media img, .hero__media img").forEach((img) => {
    const markMissing = () => img.parentElement.classList.add("is-missing");
    img.addEventListener("error", markMissing, { once: true });
    if (img.loading !== "lazy" && img.complete && img.currentSrc && img.naturalWidth === 0) markMissing();
  });

  /* ---------- Videos: fehlende ausblenden, Sektion nur zeigen, wenn mind. eins da ist ---------- */
  const videoSection = document.querySelector("[data-video-section]");
  if (videoSection) {
    const items = [...videoSection.querySelectorAll(".video")];
    let pending = items.length;
    let available = 0;
    const settle = (ok, item) => {
      if (ok) available += 1;
      else item.remove();
      pending -= 1;
      if (pending === 0 && available > 0) {
        videoSection.hidden = false;
        document.querySelectorAll("[data-video-link]").forEach((el) => { el.hidden = false; });
      }
    };
    items.forEach((item) => {
      const video = item.querySelector("video");
      const sources = video.querySelectorAll("source");
      let done = false;
      const once = (ok) => { if (!done) { done = true; settle(ok, item); } };
      video.addEventListener("loadedmetadata", () => once(true), { once: true });
      video.addEventListener("error", () => once(false), { once: true });
      if (sources.length) sources[sources.length - 1].addEventListener("error", () => once(false), { once: true });
      if (video.readyState >= 1) once(true);
      video.addEventListener("play", () => {
        videoSection.querySelectorAll("video").forEach((v) => { if (v !== video) v.pause(); });
      });
    });
  }

  /* ---------- Hero-Video (optional, liegt über dem Hero-Bild) ---------- */
  const heroVideo = document.querySelector("[data-hero-video]");
  if (heroVideo) {
    if (reduceMotion || saveData || !heroVideo.dataset.src) {
      heroVideo.remove();
    } else {
      heroVideo.addEventListener("canplay", () => {
        heroVideo.classList.add("is-ready");
        heroVideo.play().catch(() => {});
      }, { once: true });
      heroVideo.addEventListener("error", () => heroVideo.remove(), { once: true });
      heroVideo.src = heroVideo.dataset.src;
      heroVideo.load();
      if ("IntersectionObserver" in window) {
        new IntersectionObserver(([entry]) => {
          if (!heroVideo.classList.contains("is-ready")) return;
          if (entry.isIntersecting) heroVideo.play().catch(() => {});
          else heroVideo.pause();
        }).observe(heroVideo);
      }
    }
  }

  /* ---------- Aktiver Navigationspunkt ---------- */
  const links = [...document.querySelectorAll(".nav__link[href^='#']")];
  const targets = links.map((l) => document.querySelector(l.getAttribute("href"))).filter(Boolean);
  if (targets.length && "IntersectionObserver" in window) {
    const so = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const link = links.find((l) => l.getAttribute("href") === "#" + entry.target.id);
        if (!link) return;
        link.classList.toggle("is-active", entry.isIntersecting);
        if (entry.isIntersecting) link.setAttribute("aria-current", "true");
        else link.removeAttribute("aria-current");
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    targets.forEach((t) => so.observe(t));
  }

  /* ---------- Jahr im Footer ---------- */
  document.querySelectorAll("[data-year]").forEach((el) => { el.textContent = new Date().getFullYear(); });
});
