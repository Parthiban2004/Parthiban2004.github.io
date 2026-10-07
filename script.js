/* ============================================================
   Parthiban — Portfolio interactions
   ============================================================ */
(() => {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));

  document.body.classList.add("loading");
  $("#year").textContent = new Date().getFullYear();

  /* ---------- Loader ---------- */
  const loader = $("#loader");
  const loaderBar = $(".loader__bar i");
  const loaderCount = $("#loaderCount");
  let progress = 0;
  const finishLoading = () => {
    loader.classList.add("done");
    document.body.classList.remove("loading");
    document.body.classList.add("ready");
    startTyping();
    observeReveals();
  };
  if (reduceMotion) {
    finishLoading();
  } else {
    const tick = setInterval(() => {
      progress = Math.min(100, progress + Math.random() * 18 + 6);
      loaderBar.style.width = progress + "%";
      loaderCount.textContent = Math.floor(progress);
      if (progress >= 100) {
        clearInterval(tick);
        setTimeout(finishLoading, 350);
      }
    }, 90);
  }

  /* ---------- Typing effect ---------- */
  const roles = ["Software Engineer", "Cloud Data Engineer", "AI / ML Builder"];
  const typed = $("#typed");
  function startTyping() {
    if (reduceMotion) { typed.textContent = roles[0]; return; }
    let r = 0, i = roles[0].length, deleting = true;
    const step = () => {
      const word = roles[r];
      i += deleting ? -1 : 1;
      typed.textContent = word.slice(0, i);
      let delay = deleting ? 45 : 90;
      if (!deleting && i === word.length) { deleting = true; delay = 1800; }
      else if (deleting && i === 0) { deleting = false; r = (r + 1) % roles.length; delay = 300; }
      setTimeout(step, delay);
    };
    setTimeout(step, 2600);
  }

  /* ---------- Occasional glitch on the hero name ---------- */
  const heroName = $("#heroName");
  if (!reduceMotion) {
    setInterval(() => {
      heroName.classList.add("glitching");
      setTimeout(() => heroName.classList.remove("glitching"), 380);
    }, 5200);
  }

  /* ---------- Build dynamic bits ---------- */
  // Stem separation equalizer bars
  $$(".bars").forEach((bars) => {
    for (let i = 0; i < 28; i++) {
      const bar = document.createElement("i");
      bar.style.setProperty("--h", (0.3 + Math.random() * 0.7).toFixed(2));
      bar.style.animationDelay = (-Math.random() * 1.5).toFixed(2) + "s";
      bars.appendChild(bar);
    }
  });

  // Stagger chips inside skill cards
  $$(".srow .chips").forEach((list) => $$("li", list).forEach((li, i) => li.style.setProperty("--i", i)));

  // Split paragraphs into words that light up as they scroll past
  const hotWords = ["parthiban", "accenture", "remarkable"];
  const wordBlocks = $$("[data-words]").map((el) => {
    const words = el.textContent.trim().split(/\s+/);
    el.textContent = "";
    words.forEach((w, i) => {
      const span = document.createElement("span");
      span.className = "w";
      if (hotWords.includes(w.toLowerCase().replace(/[^a-z]/g, ""))) span.classList.add("hot");
      span.textContent = w;
      el.appendChild(span);
      if (i < words.length - 1) el.appendChild(document.createTextNode(" "));
    });
    return { el, words: $$(".w", el) };
  });
  if (reduceMotion) wordBlocks.forEach((b) => b.words.forEach((w) => w.classList.add("on")));

  /* ---------- Text scramble for section titles ---------- */
  const glyphs = "!<>-_\\/[]{}=+*^?#01";
  const scramble = (el) => {
    if (reduceMotion || el.dataset.done) return;
    el.dataset.done = "1";
    const final = el.textContent;
    const start = performance.now();
    const duration = 700;
    const run = (now) => {
      const t = clamp((now - start) / duration, 0, 1);
      const revealed = Math.floor(t * final.length);
      el.textContent = final
        .split("")
        .map((c, i) => (i < revealed || c === " " ? c : glyphs[Math.floor(Math.random() * glyphs.length)]))
        .join("");
      if (t < 1) requestAnimationFrame(run);
      else el.textContent = final;
    };
    requestAnimationFrame(run);
  };

  /* ---------- Scroll reveal ---------- */
  function observeReveals() {
    const els = $$(".reveal");
    els.forEach((el) => {
      const siblings = [...el.parentElement.children].filter((c) => c.classList.contains("reveal"));
      el.style.setProperty("--d", siblings.indexOf(el) * 0.08 + "s");
    });
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        e.target.classList.add("in");
        const title = $("[data-scramble]", e.target);
        if (title) setTimeout(() => scramble(title), 150);
        io.unobserve(e.target);
      });
    }, { threshold: 0.15, rootMargin: "0px 0px -40px 0px" });
    els.forEach((el) => io.observe(el));

    const projIO = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in"); projIO.unobserve(e.target); } });
    }, { threshold: 0.2 });
    $$(".project").forEach((p) => projIO.observe(p));
  }

  /* ---------- Count-up numbers ---------- */
  const countIO = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      const el = e.target;
      const target = +el.dataset.count;
      const duration = reduceMotion ? 0 : 1600;
      const begin = () => {
        const start = performance.now();
        const run = (now) => {
          const t = duration ? Math.min(1, (now - start) / duration) : 1;
          el.textContent = Math.round(target * (1 - Math.pow(1 - t, 4)));
          if (t < 1) requestAnimationFrame(run);
        };
        requestAnimationFrame(run);
      };
      // Hero numbers wait for the loader to finish
      if (document.body.classList.contains("ready")) begin();
      else setTimeout(begin, 1800);
      countIO.unobserve(el);
    });
  }, { threshold: 0.6 });
  $$("[data-count]").forEach((c) => countIO.observe(c));

  /* ---------- Nav: active link, sliding indicator, hide on scroll ---------- */
  const nav = $("#nav");
  const navLinks = $("#navLinks");
  const links = $$("a", navLinks);
  const indicator = $("#navIndicator");
  const toggle = $("#navToggle");

  const moveIndicator = (link) => {
    if (!link) return;
    indicator.style.width = link.offsetWidth + "px";
    indicator.style.transform = `translateX(${link.offsetLeft}px)`;
  };
  const setActive = (id) => {
    links.forEach((l) => {
      const on = l.getAttribute("href") === "#" + id;
      l.classList.toggle("active", on);
      if (on) moveIndicator(l);
    });
  };
  links.forEach((l) => {
    l.addEventListener("mouseenter", () => moveIndicator(l));
    l.addEventListener("click", () => {
      navLinks.classList.remove("open");
      toggle.setAttribute("aria-expanded", "false");
    });
  });
  navLinks.addEventListener("mouseleave", () => moveIndicator($("a.active", navLinks)));
  window.addEventListener("resize", () => moveIndicator($("a.active", navLinks)));
  requestAnimationFrame(() => moveIndicator($("a.active", navLinks)));

  toggle.addEventListener("click", () => {
    const open = navLinks.classList.toggle("open");
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  });

  const sections = $$("main section[id]");
  const sectionIO = new IntersectionObserver((entries) => {
    entries.forEach((e) => { if (e.isIntersecting) setActive(e.target.id); });
  }, { rootMargin: "-45% 0px -50% 0px" });
  sections.forEach((s) => sectionIO.observe(s));

  /* ---------- Scroll-driven effects ---------- */
  const progressBar = $("#progressBar");
  const fabDock = $("#fabDock");
  const topBtn = $("#toTop");
  const ghosts = $$(".section__ghost");
  const stacks = $$(".stack");
  const footerName = $("#footerName");
  const wide = window.matchMedia("(min-width: 761px)");
  let lastY = window.scrollY;
  let velocity = 0;
  let ticking = false;

  const onScroll = () => {
    const y = window.scrollY;
    const vh = window.innerHeight;
    const max = document.documentElement.scrollHeight - vh;
    const p = max > 0 ? y / max : 0;
    progressBar.style.transform = `scaleX(${p})`;
    topBtn.style.setProperty("--p", p.toFixed(3));
    velocity += y - lastY;

    nav.classList.toggle("scrolled", y > 40);
    const menuOpen = navLinks.classList.contains("open");
    nav.classList.toggle("hidden", !menuOpen && y > lastY && y > 300);
    fabDock.classList.toggle("show", y > vh * 0.5);
    lastY = y;

    // Words light up as the paragraph moves through the viewport
    if (!reduceMotion) {
      wordBlocks.forEach(({ el, words }) => {
        const r = el.getBoundingClientRect();
        const t = clamp((vh * 0.85 - r.top) / (r.height + vh * 0.35), 0, 1);
        const lit = Math.round(t * words.length);
        words.forEach((w, i) => w.classList.toggle("on", i < lit));
      });

      // Big outlined section numbers drift slower than the page
      ghosts.forEach((g) => {
        const r = g.parentElement.getBoundingClientRect();
        g.style.setProperty("--py", ((r.top - vh / 2) * -0.15).toFixed(1) + "px");
      });

      // Sticky project cards shrink and dim as the next one slides over
      stacks.forEach((s, i) => {
        const card = s.firstElementChild;
        const next = stacks[i + 1];
        if (!next || !wide.matches) { card.style.setProperty("--s", 1); card.style.setProperty("--b", 1); return; }
        const r = card.getBoundingClientRect();
        const nr = next.getBoundingClientRect();
        const t = clamp((r.bottom - nr.top) / r.height, 0, 1);
        card.style.setProperty("--s", (1 - t * 0.06).toFixed(4));
        card.style.setProperty("--b", (1 - t * 0.45).toFixed(3));
      });

      // Footer name fills with the accent as it comes into view
      const start = footerName.getBoundingClientRect().top + y - vh;
      const fp = clamp((y - start) / Math.max(1, max - start), 0, 1);
      footerName.style.setProperty("--p", (fp * 100).toFixed(1) + "%");
    }
    ticking = false;
  };
  window.addEventListener("scroll", () => {
    if (!ticking) { requestAnimationFrame(onScroll); ticking = true; }
  }, { passive: true });
  window.addEventListener("resize", onScroll);
  onScroll();

  topBtn.addEventListener("click", () => window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" }));

  /* ---------- Crossing bands: endless, and faster while scrolling ---------- */
  const tracks = $$(".band__track").map((track) => {
    const original = track.innerHTML;
    // Repeat content until one copy is wider than the screen, then double it for a seamless loop
    let copy = original;
    track.innerHTML = copy;
    while (track.scrollWidth < window.innerWidth * 1.2) { copy += original; track.innerHTML = copy; }
    track.innerHTML = copy + copy;
    return { track, dir: +track.dataset.dir, x: 0, half: track.scrollWidth / 2 };
  });
  window.addEventListener("resize", () => tracks.forEach((t) => { t.half = t.track.scrollWidth / 2; }));
  if (!reduceMotion) {
    let boost = 0;
    const loop = () => {
      boost += (Math.min(Math.abs(velocity), 120) * 0.08 - boost) * 0.08;
      const scrollDir = velocity < 0 ? -1 : 1;
      velocity *= 0.8;
      tracks.forEach((t) => {
        t.x += t.dir * (0.6 + boost) * (velocity !== 0 ? scrollDir : 1);
        if (t.x <= -t.half) t.x += t.half;
        if (t.x > 0) t.x -= t.half;
        t.track.style.transform = `translate3d(${t.x}px,0,0)`;
      });
      requestAnimationFrame(loop);
    };
    loop();
  }

  /* ---------- Button ripple ---------- */
  $$(".btn, .social-link").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const r = btn.getBoundingClientRect();
      const size = Math.max(r.width, r.height);
      const ripple = document.createElement("span");
      ripple.className = "ripple";
      ripple.style.cssText = `width:${size}px;height:${size}px;left:${e.clientX - r.left - size / 2}px;top:${e.clientY - r.top - size / 2}px`;
      btn.appendChild(ripple);
      setTimeout(() => ripple.remove(), 700);
    });
  });

  /* ---------- Custom cursor ---------- */
  if (finePointer && !reduceMotion) {
    const ring = $(".cursor");
    const dot = $(".cursor-dot");
    let mx = innerWidth / 2, my = innerHeight / 2, rx = mx, ry = my;
    window.addEventListener("mousemove", (e) => {
      mx = e.clientX; my = e.clientY;
      dot.style.transform = `translate(${mx}px, ${my}px)`;
    });
    const follow = () => {
      rx += (mx - rx) * 0.18;
      ry += (my - ry) * 0.18;
      ring.style.transform = `translate(${rx}px, ${ry}px)`;
      requestAnimationFrame(follow);
    };
    follow();
    $$("a, button, [data-tilt], [data-spot]").forEach((el) => {
      el.addEventListener("mouseenter", () => ring.classList.add("hover"));
      el.addEventListener("mouseleave", () => ring.classList.remove("hover"));
    });
  } else {
    $$(".cursor, .cursor-dot").forEach((el) => el.remove());
  }

  /* ---------- Magnetic buttons ---------- */
  if (finePointer && !reduceMotion) {
    $$("[data-magnetic]").forEach((el) => {
      const strength = el.matches(".fab, .contact__orb") ? 0.35 : 0.25;
      el.addEventListener("mousemove", (e) => {
        const r = el.getBoundingClientRect();
        const x = e.clientX - (r.left + r.width / 2);
        const y = e.clientY - (r.top + r.height / 2);
        el.style.transition = "transform 0.15s ease-out";
        el.style.transform = `translate(${x * strength}px, ${y * strength}px)`;
      });
      el.addEventListener("mouseleave", () => {
        el.style.transition = "transform 0.6s cubic-bezier(0.22, 1, 0.36, 1)";
        el.style.transform = "";
      });
    });
  }

  /* ---------- 3D tilt + spotlight cards ---------- */
  if (finePointer && !reduceMotion) {
    $$("[data-tilt], [data-spot]").forEach((el) => {
      const tilt = el.hasAttribute("data-tilt");
      el.addEventListener("mousemove", (e) => {
        const r = el.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width;
        const py = (e.clientY - r.top) / r.height;
        el.style.setProperty("--mx", px * 100 + "%");
        el.style.setProperty("--my", py * 100 + "%");
        if (!tilt || !el.classList.contains("in")) return;
        el.style.transition = "transform 0.15s ease-out";
        el.style.transform = `perspective(900px) rotateX(${(0.5 - py) * 8}deg) rotateY(${(px - 0.5) * 8}deg)`;
      });
      if (tilt) {
        el.addEventListener("mouseleave", () => {
          el.style.transition = "transform 0.7s cubic-bezier(0.22, 1, 0.36, 1)";
          el.style.transform = "";
        });
      }
    });
  }

  /* ---------- Particle constellation background ---------- */
  const canvas = $("#bg");
  const ctx = canvas.getContext("2d");
  let w, h, dpr, particles = [];
  const mouse = { x: -9999, y: -9999 };

  const resize = () => {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = canvas.width = innerWidth * dpr;
    h = canvas.height = innerHeight * dpr;
    const count = Math.min(90, Math.floor((innerWidth * innerHeight) / 16000));
    particles = Array.from({ length: count }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.25 * dpr,
      vy: (Math.random() - 0.5) * 0.25 * dpr,
      r: (Math.random() * 1.2 + 0.4) * dpr,
    }));
  };
  window.addEventListener("resize", resize);
  window.addEventListener("mousemove", (e) => { mouse.x = e.clientX * dpr; mouse.y = e.clientY * dpr; });
  window.addEventListener("mouseout", () => { mouse.x = mouse.y = -9999; });
  resize();

  const linkDist = 130;
  const draw = () => {
    ctx.clearRect(0, 0, w, h);
    const ld = linkDist * dpr;
    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      if (!reduceMotion) {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > w) p.vx *= -1;
        if (p.y < 0 || p.y > h) p.vy *= -1;
        const dx = p.x - mouse.x, dy = p.y - mouse.y;
        const d2 = dx * dx + dy * dy;
        if (d2 < (120 * dpr) ** 2) {
          const f = 0.6 / Math.sqrt(d2 || 1);
          p.x += dx * f; p.y += dy * f;
        }
      }
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(124, 245, 255, 0.55)";
      ctx.fill();
      for (let j = i + 1; j < particles.length; j++) {
        const q = particles[j];
        const dist = Math.hypot(p.x - q.x, p.y - q.y);
        if (dist < ld) {
          ctx.strokeStyle = `rgba(124, 245, 255, ${(1 - dist / ld) * 0.14})`;
          ctx.lineWidth = dpr * 0.6;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(q.x, q.y);
          ctx.stroke();
        }
      }
    }
    if (!reduceMotion) requestAnimationFrame(draw);
  };
  draw();

  /* ---------- Hero parallax on orb ---------- */
  const orb = $(".orb");
  if (finePointer && !reduceMotion && orb) {
    window.addEventListener("mousemove", (e) => {
      const x = (e.clientX / innerWidth - 0.5) * 30;
      const y = (e.clientY / innerHeight - 0.5) * 30;
      orb.style.transform = `translate(${x}px, ${y}px)`;
    });
  }
})();
