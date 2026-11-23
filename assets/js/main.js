/* MH Autopflege – Interaktionen (ohne Abhängigkeiten, CSP-konform). */
document.addEventListener("DOMContentLoaded", () => {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const saveData = Boolean(navigator.connection && navigator.connection.saveData);
  const isSmall = window.matchMedia("(max-width: 760px)").matches;
  const scrollBehavior = reduceMotion ? "auto" : "smooth";

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

  /* ---------- Fehlende Bilder ----------
     Nur echte Ladefehler werten. Lazy-Bilder nicht über img.complete prüfen:
     Safari meldet complete=true, solange ein Lazy-Bild noch nicht geladen wurde. */
  document.querySelectorAll(".media img, .hero__media img").forEach((img) => {
    const markMissing = () => img.parentElement.classList.add("is-missing");
    img.addEventListener("error", markMissing, { once: true });
    if (img.loading !== "lazy" && img.complete && img.currentSrc && img.naturalWidth === 0) markMissing();
  });

  /* ---------- Hero-Hintergrundvideo (Handy: kleinere Datei) ---------- */
  const heroVideo = document.querySelector("[data-hero-video]");
  if (heroVideo) {
    const src = (isSmall && heroVideo.dataset.srcMobile) || heroVideo.dataset.src;
    if (reduceMotion || saveData || !src) {
      heroVideo.remove();
    } else {
      heroVideo.addEventListener("canplay", () => {
        heroVideo.classList.add("is-ready");
        heroVideo.play().catch(() => {});
      }, { once: true });
      heroVideo.addEventListener("error", () => heroVideo.remove(), { once: true });
      heroVideo.src = src;
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

  /* ---------- Leistungen: Tabs ----------
     Ohne JS bleiben alle Bereiche sichtbar; mit JS ist immer einer aktiv. */
  const tablist = document.querySelector('[role="tablist"]');
  const tabs = tablist ? [...tablist.querySelectorAll('[role="tab"]')] : [];
  const panels = tabs.map((t) => document.getElementById(t.getAttribute("aria-controls")));
  const selectTab = (index, focus) => {
    tabs.forEach((tab, i) => {
      const active = i === index;
      tab.setAttribute("aria-selected", String(active));
      tab.tabIndex = active ? 0 : -1;
      panels[i].hidden = !active;
    });
    if (focus) tabs[index].focus();
  };
  if (tabs.length) {
    tablist.closest(".section").classList.add("js-tabs");
    tablist.hidden = false;
    selectTab(0, false);
    tabs.forEach((tab, i) => {
      tab.addEventListener("click", () => selectTab(i, false));
      tab.addEventListener("keydown", (e) => {
        const keys = { ArrowRight: i + 1, ArrowLeft: i - 1, Home: 0, End: tabs.length - 1 };
        if (!(e.key in keys)) return;
        e.preventDefault();
        selectTab((keys[e.key] + tabs.length) % tabs.length, true);
      });
    });
    // Links auf #aussen / #innen / #zusatz (z. B. im Footer) öffnen den passenden Tab
    const openFromHash = (hash, smooth) => {
      const i = panels.findIndex((p) => "#" + p.id === hash);
      if (i < 0) return false;
      selectTab(i, false);
      tablist.scrollIntoView({ behavior: smooth ? scrollBehavior : "auto", block: "start" });
      return true;
    };
    document.querySelectorAll('a[href^="#"]').forEach((a) => {
      a.addEventListener("click", (e) => {
        if (openFromHash(a.getAttribute("href"), true)) {
          e.preventDefault();
          history.replaceState(null, "", a.getAttribute("href"));
        }
      });
    });
    if (location.hash) openFromHash(location.hash, false);
  }

  /* ---------- Galerie: Pfeile (Desktop), Wischen (Handy) ---------- */
  const gallery = document.querySelector(".gallery");
  const galBtns = [...document.querySelectorAll("[data-gal]")];
  if (gallery && galBtns.length) {
    const update = () => {
      const max = gallery.scrollWidth - gallery.clientWidth - 2;
      galBtns.forEach((b) => {
        b.hidden = max <= 0;
        b.disabled = b.dataset.gal === "-1" ? gallery.scrollLeft <= 2 : gallery.scrollLeft >= max;
      });
    };
    galBtns.forEach((b) => b.addEventListener("click", () => {
      gallery.scrollBy({ left: Number(b.dataset.gal) * gallery.clientWidth * 0.8, behavior: scrollBehavior });
    }));
    gallery.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    update();
  }

  /* ---------- Handy-Aktionsleiste: nach dem Hero einblenden, im Kontaktbereich ausblenden ---------- */
  const bar = document.querySelector("[data-mobilebar]");
  const hero = document.querySelector(".hero");
  const contact = document.getElementById("kontakt");
  if (bar && hero && "IntersectionObserver" in window) {
    let pastHero = false;
    let atContact = false;
    const render = () => bar.classList.toggle("is-visible", pastHero && !atContact);
    new IntersectionObserver(([e]) => { pastHero = !e.isIntersecting; render(); }, { rootMargin: "-30% 0px 0px 0px" }).observe(hero);
    if (contact) new IntersectionObserver(([e]) => { atContact = e.isIntersecting; render(); }, { threshold: 0.25 }).observe(contact);
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
