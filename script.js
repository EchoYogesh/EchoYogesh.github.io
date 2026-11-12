/* ============================================================
   Brijesh & Sangeeta — wedding invitation
   Countdown · navigation · RSVP form
   ============================================================ */

/* ── EDIT ME ───────────────────────────────────────────────────
   Everything a guest-facing change might need lives here.
   ───────────────────────────────────────────────────────────── */

const CONFIG = {
  // Countdown target: the baraat muhurat on Sunday 31 January 2027.
  weddingDate: "2027-01-31T16:00:00+05:30",

  // The four functions, used for the "add to calendar" file.
  events: [
    {
      name: "Haldi",
      start: "2027-01-30T15:00:00+05:30",
      end: "2027-01-30T18:00:00+05:30",
      place: "Family home, Village Jhaliyahwa, Chandauka, Kohandaur, Pratapgarh, UP",
    },
    {
      name: "Mehndi",
      start: "2027-01-30T19:00:00+05:30",
      end: "2027-01-30T23:00:00+05:30",
      place: "Family home, Village Jhaliyahwa, Chandauka, Kohandaur, Pratapgarh, UP",
    },
    {
      name: "Shaadi",
      start: "2027-01-31T16:00:00+05:30",
      end: "2027-01-31T23:30:00+05:30",
      place: "Family home, Village Jhaliyahwa, Chandauka, Kohandaur, Pratapgarh, UP",
    },
    {
      name: "Reception",
      start: "2027-02-02T17:00:00+05:30",
      end: "2027-02-02T22:00:00+05:30",
      place: "Family home, Village Jhaliyahwa, Chandauka, Kohandaur, Pratapgarh, UP",
    },
  ],

  // Optional: paste a form endpoint (Formspree, Basin, a Google Apps Script
  // web app…) to collect replies. Leave "" to fall back to a pre-filled email.
  rsvpEndpoint: "",
  rsvpEmail: "ybrijesh.005@gmail.com",

  // Shown on the confirmation card.
  replyByLine: "We can't wait to welcome you to Jhaliyahwa.",
};

/* ── Helpers ─────────────────────────────────────────────────── */

const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ── Countdown ───────────────────────────────────────────────── */

(function countdown() {
  const grid = $("#countdownGrid");
  if (!grid) return;

  const target = new Date(CONFIG.weddingDate).getTime();
  const cells = {
    days: $('[data-unit="days"]', grid),
    hours: $('[data-unit="hours"]', grid),
    minutes: $('[data-unit="minutes"]', grid),
    seconds: $('[data-unit="seconds"]', grid),
  };
  const pad = (n) => String(n).padStart(2, "0");
  let lastSec = null;
  let timer;

  function paint() {
    const diff = target - Date.now();

    if (diff <= 0) {
      grid.innerHTML =
        '<p class="countdown__lead" style="grid-column:1/-1">Today is the day.</p>';
      clearInterval(timer);
      return;
    }

    const sec = Math.floor(diff / 1000);
    const seconds = sec % 60;
    cells.days.textContent = String(Math.floor(sec / 86400));
    cells.hours.textContent = pad(Math.floor((sec % 86400) / 3600));
    cells.minutes.textContent = pad(Math.floor((sec % 3600) / 60));
    cells.seconds.textContent = pad(seconds);

    // A quiet flash on each new second.
    if (!reduceMotion && lastSec !== null && seconds !== lastSec) {
      cells.seconds.classList.remove("is-tick");
      void cells.seconds.offsetWidth;
      cells.seconds.classList.add("is-tick");
    }
    lastSec = seconds;
  }

  paint();
  timer = setInterval(paint, 1000);
})();

/* ── Navigation ──────────────────────────────────────────────── */

(function navigation() {
  const nav = $("#nav");
  const toggle = $("#navToggle");
  const links = $("#navLinks");
  if (!nav) return;

  function onScroll() {
    nav.classList.toggle("is-stuck", window.scrollY > 40);
  }
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  if (toggle && links) {
    toggle.addEventListener("click", () => {
      const open = nav.dataset.open === "true";
      nav.dataset.open = String(!open);
      toggle.setAttribute("aria-expanded", String(!open));
    });

    links.addEventListener("click", (e) => {
      if (e.target.closest("a")) {
        nav.dataset.open = "false";
        toggle.setAttribute("aria-expanded", "false");
      }
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && nav.dataset.open === "true") {
        nav.dataset.open = "false";
        toggle.setAttribute("aria-expanded", "false");
        toggle.focus();
      }
    });
  }

  const sections = $$("main section[id]");
  if ("IntersectionObserver" in window && sections.length) {
    const active = new Map();
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => active.set(entry.target.id, entry.isIntersecting));
        let current = null;
        for (const [id, visible] of active) if (visible) current = id;
        $$(".nav__links a", nav).forEach((a) => {
          const href = a.getAttribute("href") || "";
          a.classList.toggle("is-active", href === `#${current}`);
        });
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 }
    );
    sections.forEach((s) => io.observe(s));
  }
})();

/* ── Reveal on scroll ────────────────────────────────────────── */

(function reveals() {
  const items = $$(".reveal");
  if (!items.length) return;

  if (reduceMotion || !("IntersectionObserver" in window)) {
    items.forEach((el) => el.classList.add("is-in"));
    return;
  }

  const groups = new Map();
  items.forEach((el) => {
    const parent = el.parentElement;
    const index = groups.get(parent) || 0;
    groups.set(parent, index + 1);
    if (index < 6) el.style.setProperty("--reveal-delay", `${index * 90}ms`);
  });

  const io = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-in");
          observer.unobserve(entry.target);
        }
      });
    },
    { rootMargin: "0px 0px -8% 0px", threshold: 0.08 }
  );

  items.forEach((el) => io.observe(el));
})();

/* ── RSVP form ───────────────────────────────────────────────── */

(function rsvp() {
  const form = $("#rsvpForm");
  if (!form) return;

  const status = $("#rsvpStatus");
  const done = $("#rsvpDone");
  const doneText = $("#rsvpDoneText");
  const details = $("#attendingDetails");
  const submit = $("#rsvpSubmit");
  const calendarLink = $("#calendarLink");

  const FIELD_LABELS = {
    haldi: "Haldi",
    mehndi: "Mehndi",
    shaadi: "Shaadi",
    reception: "Reception",
  };

  const fieldOf = (input) => input.closest(".field");
  const errorFor = (name) => $(`[data-error-for="${name}"]`);
  const eventBoxes = $$('input[name="events"]', form);

  function clearError(input) {
    const field = fieldOf(input);
    if (field) field.classList.remove("has-error");
    const slot = errorFor(input.id || input.name);
    if (slot) slot.textContent = "";
    input.removeAttribute("aria-invalid");
  }

  function setError(input, message) {
    const field = fieldOf(input);
    if (field) field.classList.add("has-error");
    const slot = errorFor(input.id || input.name);
    if (slot) slot.textContent = message;
    input.setAttribute("aria-invalid", "true");
  }

  function attendingYes() {
    return form.elements.attending.value === "yes";
  }

  $$('input[name="attending"]', form).forEach((radio) => {
    radio.addEventListener("change", () => {
      if (details) details.classList.toggle("is-dimmed", !attendingYes());
      clearError(radio);
    });
  });

  form.addEventListener("input", (e) => {
    if (e.target.matches("input, select, textarea")) clearError(e.target);
  });

  function validate() {
    let ok = true;
    const names = form.elements.names;
    const email = form.elements.email;

    if (!names.value.trim()) {
      setError(names, "Please tell us who's coming.");
      ok = false;
    } else if (names.value.trim().length < 2) {
      setError(names, "A name, however brief, helps us find your seat.");
      ok = false;
    }

    const value = email.value.trim();
    if (!value) {
      setError(email, "We need an email to send the details.");
      ok = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value)) {
      setError(email, "That email doesn't look quite right.");
      ok = false;
    }

    if (!form.elements.attending.value) {
      const lastRadio = $$('input[name="attending"]', form).pop();
      setError(lastRadio, "Let us know either way — we'd love a firm answer.");
      ok = false;
    } else if (attendingYes() && !eventBoxes.some((b) => b.checked)) {
      setError(eventBoxes[0], "Tick at least one function you'll be joining.");
      ok = false;
    }

    if (!ok) {
      const firstBad = $(".has-error input, .has-error select, .has-error textarea", form);
      if (firstBad) firstBad.focus();
      status.textContent = "";
    }
    return ok;
  }

  function collect() {
    const data = new FormData(form);
    const attending = data.get("attending");
    const chosen = attending === "yes" ? eventBoxes.filter((b) => b.checked).map((b) => b.value) : [];
    return {
      names: String(data.get("names") || "").trim(),
      email: String(data.get("email") || "").trim(),
      phone: String(data.get("phone") || "").trim(),
      attending,
      events: chosen,
      guests: attending === "yes" ? data.get("guests") : "0",
      meal: attending === "yes" ? data.get("meal") : "",
      diet: String(data.get("diet") || "").trim(),
      stay: attending === "yes" ? data.get("stay") : "",
      note: String(data.get("note") || "").trim(),
      sentAt: new Date().toISOString(),
    };
  }

  function summary(reply) {
    if (reply.attending === "no") {
      return "We'll miss you — thank you for telling us, and we'll raise a glass to you in January.";
    }
    const list = reply.events.map((e) => FIELD_LABELS[e]).join(", ");
    const n = Number(reply.guests) || 1;
    const people = n > 1 ? `${n} places` : "A place";
    return `${people} saved for ${list}. ${CONFIG.replyByLine}`;
  }

  function finish(reply) {
    form.hidden = true;
    done.hidden = false;
    doneText.textContent = summary(reply);
    done.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "center" });
  }

  const stamp = (d) =>
    new Date(d).toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
  const escapeText = (t) => String(t).replace(/([,;\\])/g, "\\$1").replace(/\n/g, "\\n");

  // One calendar file holding all four functions.
  function calendarFile() {
    const lines = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//Brijesh and Sangeeta//Wedding//EN",
      "CALSCALE:GREGORIAN",
      "METHOD:PUBLISH",
      "X-WR-CALNAME:Brijesh & Sangeeta — Wedding",
    ];

    CONFIG.events.forEach((ev, i) => {
      lines.push(
        "BEGIN:VEVENT",
        `UID:wedding-${ev.name.toLowerCase()}-${i}@brijeshandsangeeta`,
        `DTSTAMP:${stamp(new Date())}`,
        `DTSTART:${stamp(ev.start)}`,
        `DTEND:${stamp(ev.end)}`,
        `SUMMARY:${escapeText(`Brijesh & Sangeeta — ${ev.name}`)}`,
        `LOCATION:${escapeText(ev.place)}`,
        `DESCRIPTION:${escapeText("Part of Brijesh and Sangeeta's wedding celebrations.")}`,
        "END:VEVENT"
      );
    });

    lines.push("END:VCALENDAR");
    return new Blob([lines.join("\r\n")], { type: "text/calendar;charset=utf-8" });
  }

  let calendarUrl = null;
  function offerCalendar(reply) {
    if (!calendarLink) return;
    if (reply.attending !== "yes") {
      calendarLink.hidden = true;
      return;
    }
    if (calendarUrl) URL.revokeObjectURL(calendarUrl);
    calendarUrl = URL.createObjectURL(calendarFile());
    calendarLink.href = calendarUrl;
    calendarLink.hidden = false;
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (!validate()) {
      status.textContent = "Just a couple of things to fix above.";
      return;
    }

    const reply = collect();
    form.setAttribute("aria-busy", "true");
    submit.disabled = true;
    status.textContent = "Sending…";

    try {
      if (CONFIG.rsvpEndpoint) {
        const res = await fetch(CONFIG.rsvpEndpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json", Accept: "application/json" },
          body: JSON.stringify(reply),
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
      } else {
        const subject = `RSVP — ${reply.names}`;
        const body = [
          `Name(s): ${reply.names}`,
          `Email: ${reply.email}`,
          reply.phone ? `Phone: ${reply.phone}` : "",
          `Attending: ${reply.attending === "yes" ? "Yes" : "No"}`,
          reply.events.length ? `Functions: ${reply.events.map((x) => FIELD_LABELS[x]).join(", ")}` : "",
          reply.attending === "yes" ? `Guests: ${reply.guests}` : "",
          reply.meal ? `Meal: ${reply.meal}` : "",
          reply.diet ? `Dietary: ${reply.diet}` : "",
          reply.stay ? `Travel/stay: ${reply.stay}` : "",
          reply.note ? `Note: ${reply.note}` : "",
        ]
          .filter(Boolean)
          .join("\n");

        window.location.href =
          `mailto:${CONFIG.rsvpEmail}?subject=${encodeURIComponent(subject)}` +
          `&body=${encodeURIComponent(body)}`;
      }

      try {
        localStorage.setItem("rsvp-brijesh-sangeeta", JSON.stringify(reply));
      } catch (_) {
        /* private mode — no matter */
      }

      offerCalendar(reply);
      finish(reply);
      status.textContent = "";
    } catch (err) {
      status.textContent = CONFIG.rsvpEndpoint
        ? "That didn't go through. Please try again, or email us directly."
        : `Your mail app didn't open. You can write to us at ${CONFIG.rsvpEmail}.`;
      console.error("RSVP failed:", err);
    } finally {
      form.removeAttribute("aria-busy");
      submit.disabled = false;
    }
  });

  $("#rsvpAgain").addEventListener("click", () => {
    done.hidden = true;
    form.hidden = false;
    form.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
    form.elements.names.focus();
  });

  // Restore an earlier reply so nobody has to retype it.
  try {
    const saved = JSON.parse(localStorage.getItem("rsvp-brijesh-sangeeta") || "null");
    if (saved && saved.names) {
      form.elements.names.value = saved.names;
      if (saved.email) form.elements.email.value = saved.email;
      if (saved.phone) form.elements.phone.value = saved.phone;
      if (saved.attending) {
        const radio = $(`input[name="attending"][value="${saved.attending}"]`, form);
        if (radio) radio.checked = true;
        if (saved.attending === "no" && details) details.classList.add("is-dimmed");
      }
      (saved.events || []).forEach((value) => {
        const box = $(`input[name="events"][value="${value}"]`, form);
        if (box) box.checked = true;
      });
      if (saved.guests) form.elements.guests.value = saved.guests;
      if (saved.meal) form.elements.meal.value = saved.meal;
      if (saved.diet) form.elements.diet.value = saved.diet;
      if (saved.stay) form.elements.stay.value = saved.stay;
      if (saved.note) form.elements.note.value = saved.note;
    }
  } catch (_) {
    /* nothing saved, or storage blocked */
  }
})();

/* ── Hero parallax ───────────────────────────────────────────── */

(function heroParallax() {
  const inner = $(".hero__inner");
  if (!inner || reduceMotion) return;

  let frame = null;

  function update() {
    frame = null;
    const y = Math.min(window.scrollY, window.innerHeight);
    inner.style.transform = `translate3d(0, ${(y * 0.03).toFixed(2)}px, 0)`;
  }

  window.addEventListener("scroll", () => {
    if (!frame) frame = requestAnimationFrame(update);
  }, { passive: true });
})();

/* ── Petals ──────────────────────────────────────────────────────
   Flowers drift down the page all the time, and scatter away from
   a finger or a cursor — touching the page should feel like
   touching the flowers on the card.
   ───────────────────────────────────────────────────────────── */

(function petals() {
  const canvas = $("#petals");
  if (!canvas || reduceMotion) return;

  const ctx = canvas.getContext("2d");
  const COLORS = ["#c9483f", "#d99a2b", "#e0a3a0", "#e8c07a", "#b8564f"];
  const petals = [];
  let width = 0;
  let height = 0;
  let dpr = 1;

  function size() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
    canvas.style.width = width + "px";
    canvas.style.height = height + "px";
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function makePetal(fromTouch) {
    return {
      x: Math.random() * width,
      y: fromTouch ? -20 : Math.random() * -height,
      r: 3 + Math.random() * 5,
      rot: Math.random() * Math.PI * 2,
      spin: (Math.random() - 0.5) * 0.02,
      vy: 0.25 + Math.random() * 0.65,
      vx: (Math.random() - 0.5) * 0.4,
      sway: 0.4 + Math.random() * 1.2,
      phase: Math.random() * Math.PI * 2,
      color: COLORS[(Math.random() * COLORS.length) | 0],
      alpha: 0.55 + Math.random() * 0.4,
      life: null,
    };
  }

  function resetPopulate() {
    const count = width < 520 ? 16 : 34;
    petals.length = 0;
    for (let i = 0; i < count; i++) petals.push(makePetal(false));
  }

  function drawPetal(p) {
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(p.rot);
    ctx.globalAlpha = p.alpha;
    ctx.fillStyle = p.color;
    ctx.beginPath();
    ctx.moveTo(0, -p.r);
    ctx.bezierCurveTo(p.r * 0.95, -p.r * 0.55, p.r * 0.7, p.r * 0.85, 0, p.r);
    ctx.bezierCurveTo(-p.r * 0.7, p.r * 0.85, -p.r * 0.95, -p.r * 0.55, 0, -p.r);
    ctx.fill();
    ctx.globalAlpha = p.alpha * 0.35;
    ctx.fillStyle = "#fff8ec";
    ctx.beginPath();
    ctx.ellipse(-p.r * 0.15, -p.r * 0.1, p.r * 0.26, p.r * 0.5, 0.3, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  let last = performance.now();
  let running = true;

  function frame(now) {
    if (!running) return;
    const dt = Math.min(now - last, 40) / 16.67;
    last = now;
    ctx.clearRect(0, 0, width, height);

    for (let i = petals.length - 1; i >= 0; i--) {
      const p = petals[i];
      p.phase += 0.01 * dt;
      p.x += (p.vx + Math.sin(p.phase) * p.sway * 0.35) * dt;
      p.y += p.vy * dt;
      p.rot += p.spin * dt;

      // a finger nearby pushes the petals aside
      if (pointer.active) {
        const dx = p.x - pointer.x;
        const dy = p.y - pointer.y;
        const dist = Math.hypot(dx, dy);
        if (dist < 90 && dist > 0.5) {
          const force = (1 - dist / 90) * 2.6;
          p.x += (dx / dist) * force * dt;
          p.y += (dy / dist) * force * dt;
          p.rot += force * 0.02;
        }
      }

      if (p.life !== null) {
        p.life -= dt;
        p.alpha *= 0.995;
        if (p.life <= 0) { petals.splice(i, 1); continue; }
      }

      // recycle off the edges
      if (p.y - p.r > height + 10 || p.x < -40 || p.x > width + 40) {
        if (p.life === null) {
          p.y = -12;
          p.x = Math.random() * width;
          p.alpha = 0.55 + Math.random() * 0.4;
        } else {
          petals.splice(i, 1);
          continue;
        }
      }

      drawPetal(p);
    }
    requestAnimationFrame(frame);
  }

  // Where the finger or the cursor is
  const pointer = { x: 0, y: 0, active: false };

  function burst(x, y, n) {
    for (let i = 0; i < n; i++) {
      const p = makePetal(true);
      p.x = x + (Math.random() - 0.5) * 26;
      p.y = y + (Math.random() - 0.5) * 20;
      p.vy = -0.6 - Math.random() * 1.5;
      p.vx = (Math.random() - 0.5) * 2.4;
      p.life = 150 + Math.random() * 90;
      p.r = 3 + Math.random() * 5.5;
      petals.push(p);
    }
  }

  function point(e) {
    const t = e.touches ? e.touches[0] : e;
    return { x: t.clientX, y: t.clientY };
  }

  window.addEventListener("pointermove", (e) => {
    const pt = point(e);
    pointer.x = pt.x;
    pointer.y = pt.y;
    pointer.active = true;
  }, { passive: true });

  window.addEventListener("pointerdown", (e) => {
    const pt = point(e);
    pointer.x = pt.x;
    pointer.y = pt.y;
    pointer.active = true;
    burst(pt.x, pt.y, width < 520 ? 8 : 12);
  }, { passive: true });

  window.addEventListener("pointerleave", () => { pointer.active = false; });
  window.addEventListener("blur", () => { pointer.active = false; });

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      running = false;
    } else {
      running = true;
      last = performance.now();
      requestAnimationFrame(frame);
    }
  });

  window.addEventListener("resize", () => {
    size();
    resetPopulate();
  });

  size();
  resetPopulate();
  requestAnimationFrame(frame);
})();
