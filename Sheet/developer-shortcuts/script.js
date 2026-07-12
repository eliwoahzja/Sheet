/* ---------------------------------------------------------------
   Developer Shortcuts — interactive cheatsheet
   --------------------------------------------------------------- */

(() => {
  // Assign stable unique ids to each shortcut
  SHORTCUTS.forEach((s, i) => {
    s.id = s.id || `${s.lang}-${i}`;
  });

  const grid = document.getElementById("grid");
  const categoriesEl = document.getElementById("categories");
  const searchInput = document.getElementById("search");
  const countEl = document.getElementById("count");
  const emptyEl = document.getElementById("empty");
  const backToTop = document.getElementById("backToTop");
  const langSelect = document.getElementById("langSelect");
  const filterSelect = document.getElementById("filterSelect");
  const pageLoader = document.getElementById("pageLoader");

  const STORAGE_KEY = "dev-shortcuts-read";
  const SCROLL_KEY = "dev-shortcuts-scroll";

  let state = {
    lang: "html",
    category: "all",
    query: "",
    filter: "all",
  };

  function escapeHtml(str) {
    return str
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  }

  function getReadMap() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : {};
    } catch {
      return {};
    }
  }

  function setReadMap(map) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(map));
    } catch {
      // ignore storage errors
    }
  }

  function getReadPercent(id) {
    const map = getReadMap();
    return map[id] || 0;
  }

  function setReadPercent(id, percent) {
    const map = getReadMap();
    map[id] = Math.max(0, Math.min(100, Math.round(percent)));
    setReadMap(map);
  }

  function toggleRead(id) {
    const current = getReadPercent(id);
    const next = current >= 100 ? 0 : 100;
    setReadPercent(id, next);
    return next;
  }

  function getCategories(lang) {
    const set = new Set(SHORTCUTS.filter(s => s.lang === lang).map(s => s.cat));
    return ["all", ...set];
  }

  function renderCategories() {
    const cats = getCategories(state.lang);
    categoriesEl.innerHTML = cats
      .map(cat => `<button class="chip${cat === state.category ? " active" : ""}" data-cat="${escapeHtml(cat)}">${cat === "all" ? "All" : escapeHtml(cat)}</button>`)
      .join("");
  }

  function filteredShortcuts() {
    const q = state.query.trim().toLowerCase();
    let items = SHORTCUTS.filter(s => {
      if (s.lang !== state.lang) return false;
      if (state.category !== "all" && s.cat !== state.category) return false;
      if (!q) return true;
      return (
        s.shortcut.toLowerCase().includes(q) ||
        s.desc.toLowerCase().includes(q) ||
        s.cat.toLowerCase().includes(q) ||
        s.example.toLowerCase().includes(q)
      );
    });

    if (state.filter === "alphabetical") {
      items = [...items].sort((a, b) => a.shortcut.localeCompare(b.shortcut));
    } else if (["easy", "medium", "hard"].includes(state.filter)) {
      items = items.filter(s => s.difficulty === state.filter);
    }

    return items;
  }

  function renderGrid() {
    const items = filteredShortcuts();
    countEl.textContent = items.length ? `${items.length} shortcut${items.length === 1 ? "" : "s"}` : "";
    emptyEl.hidden = items.length !== 0;

    grid.innerHTML = items
      .map((s, i) => {
        const readPercent = getReadPercent(s.id);
        const isRead = readPercent >= 100;
        const labelText = isRead ? "Read" : readPercent > 0 ? `${readPercent}% viewed` : "Not read";
        return `
        <article class="card ${s.difficulty}" data-id="${escapeHtml(s.id)}" style="animation-delay:${Math.min(i * 25, 300)}ms">
          <span class="card-cat">${escapeHtml(s.cat)}</span>
          <code class="shortcut">${escapeHtml(s.shortcut)}</code>
          <p class="desc">${escapeHtml(s.desc)}</p>
          <pre><code>${escapeHtml(s.example)}</code></pre>
          <div class="difficulty-bar">
            <span class="difficulty-label">Difficulty</span>
            <span class="difficulty-name ${s.difficulty}">${s.difficulty}</span>
          </div>
          <div class="read-progress">
            <div class="read-progress-track" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${readPercent}" aria-label="Read progress for ${escapeHtml(s.shortcut)}">
              <div class="read-progress-fill ${isRead ? "read" : ""}" style="width:${readPercent}%"></div>
            </div>
            <div class="read-status">
              <span class="read-label">${labelText}</span>
              <button class="read-toggle ${isRead ? "read" : ""}" data-id="${escapeHtml(s.id)}" type="button">${isRead ? "Mark unread" : "Mark read"}</button>
            </div>
          </div>
        </article>
      `;
      })
      .join("");
  }

  function render() {
    renderCategories();
    renderGrid();
  }

  function updateFilterFromSelect() {
    state.filter = filterSelect.value;
    renderGrid();
    observeCards();
  }

  function updateLangFromSelect() {
    state.lang = langSelect.value;
    state.category = "all";
    render();
    observeCards();
  }

  langSelect.addEventListener("change", updateLangFromSelect);
  filterSelect.addEventListener("change", updateFilterFromSelect);

  categoriesEl.addEventListener("click", (e) => {
    const chip = e.target.closest(".chip");
    if (!chip) return;
    state.category = chip.dataset.cat;
    render();
    observeCards();
  });

  grid.addEventListener("click", (e) => {
    const toggle = e.target.closest(".read-toggle");
    if (!toggle) return;
    const id = toggle.dataset.id;
    const next = toggleRead(id);
    const card = toggle.closest(".card");
    if (card) {
      const fill = card.querySelector(".read-progress-fill");
      const label = card.querySelector(".read-label");
      if (fill) {
        fill.style.width = `${next}%`;
        fill.classList.toggle("read", next >= 100);
      }
      if (label) label.textContent = next >= 100 ? "Read" : "Not read";
      toggle.textContent = next >= 100 ? "Mark unread" : "Mark read";
      toggle.classList.toggle("read", next >= 100);
    }
  });

  let debounceId;
  searchInput.addEventListener("input", (e) => {
    clearTimeout(debounceId);
    debounceId = setTimeout(() => {
      state.query = e.target.value;
      renderGrid();
      observeCards();
    }, 120);
  });

  // Back-to-top button
  window.addEventListener("scroll", () => {
    backToTop.classList.toggle("visible", window.scrollY > 400);
  });
  backToTop.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  // Single IntersectionObserver for scroll-based read progress
  const progressObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      const card = entry.target;
      const id = card.dataset.id;
      const visiblePercent = Math.round(entry.intersectionRatio * 100);
      const current = getReadPercent(id);
      const next = Math.max(current, visiblePercent);
      if (next !== current) {
        setReadPercent(id, next);
      }

      const fill = card.querySelector(".read-progress-fill");
      const label = card.querySelector(".read-label");
      const toggle = card.querySelector(".read-toggle");
      if (fill) {
        fill.style.width = `${next}%`;
        fill.classList.toggle("read", next >= 100);
      }
      if (label) label.textContent = next >= 100 ? "Read" : next > 0 ? `${next}% viewed` : "Not read";
      if (toggle) {
        toggle.textContent = next >= 100 ? "Mark unread" : "Mark read";
        toggle.classList.toggle("read", next >= 100);
      }
    });
  }, { threshold: [0, 0.25, 0.5, 0.75, 1] });

  function observeCards() {
    document.querySelectorAll(".card").forEach(card => progressObserver.observe(card));
  }

  // Restore last scroll position after initial render
  function restoreScroll() {
    try {
      const savedY = localStorage.getItem(SCROLL_KEY);
      if (savedY) window.scrollTo({ top: parseInt(savedY, 10), behavior: "auto" });
    } catch {}
  }

  // Save scroll position on scroll (throttled)
  let scrollTimeout;
  window.addEventListener("scroll", () => {
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(() => {
      try { localStorage.setItem(SCROLL_KEY, String(window.scrollY)); } catch {}
    }, 150);
  });

  // Initial render
  render();
  observeCards();
  restoreScroll();

  // Hide page loader after a short delay
  function hideLoader() {
    setTimeout(() => pageLoader.classList.add("hidden"), 400);
  }
  if (document.readyState === "complete") {
    hideLoader();
  } else {
    window.addEventListener("load", hideLoader);
  }
})();
