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

  // The five functions, used for the "add to calendar" file.
  events: [
    {
      name: "Haldi",
      start: "2027-01-30T15:00:00+05:30",
      end: "2027-01-30T18:00:00+05:30",
      place: "Family home, Village Chandauka, Kohandaur, Pratapgarh, UP",
    },
    {
      name: "Mehndi",
      start: "2027-01-30T19:00:00+05:30",
      end: "2027-01-30T23:00:00+05:30",
      place: "Family home, Village Chandauka, Kohandaur, Pratapgarh, UP",
    },
    {
      name: "DJ night",
      start: "2027-01-30T22:00:00+05:30",
      end: "2027-01-31T01:00:00+05:30",
      place: "Garden, Family home, Village Chandauka, Kohandaur, Pratapgarh, UP",
    },
    {
      name: "Shaadi",
      start: "2027-01-31T16:00:00+05:30",
      end: "2027-01-31T23:30:00+05:30",
      place: "Family home, Village Chandauka, Kohandaur, Pratapgarh, UP",
    },
    {
      name: "Reception",
      start: "2027-02-02T17:00:00+05:30",
      end: "2027-02-02T22:00:00+05:30",
      place: "Family home, Village Chandauka, Kohandaur, Pratapgarh, UP",
    },
  ],

  // Optional: paste a form endpoint (Formspree, Basin, a Google Apps Script
  // web app…) to collect replies. Leave "" to fall back to a pre-filled email.
  rsvpEndpoint: "",
  rsvpEmail: "ybrijesh.005@gmail.com",

  // Shown on the confirmation card.
  replyByLine: "We can't wait to welcome you to Chandauka.",
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
    dj: "DJ night",
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

    const passCard = $("#weddingPassCard");
    const passGuestName = $("#passGuestName");
    const passDetails = $("#passDetails");
    const googleCalLink = $("#googleCalendarLink");

    if (passCard) {
      if (reply.attending === "yes") {
        passCard.hidden = false;
        if (passGuestName) passGuestName.textContent = reply.names;
        if (passDetails) {
          const eventsList = (reply.events || []).map((e) => FIELD_LABELS[e] || e).join(", ");
          const gCount = Number(reply.guests) || 1;
          passDetails.textContent = `${eventsList} · ${gCount} ${gCount > 1 ? "Guests" : "Guest"} · Village Chandauka, Pratapgarh, UP`;
        }
        if (googleCalLink) {
          const gTitle = encodeURIComponent("Brijesh & Sangeeta — Wedding Celebrations");
          const gDetails = encodeURIComponent("Wedding celebrations of Brijesh Yadav & Sangeeta Yadav.\nVenue: Village Chandauka, Kohandaur, Pratapgarh, UP.\nContacts: +91 7503156003, +91 9540984699");
          const gLocation = encodeURIComponent("Village Chandauka, Kohandaur, Pratapgarh, Uttar Pradesh");
          googleCalLink.href = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${gTitle}&dates=20270130T093000Z/20270202T173000Z&details=${gDetails}&location=${gLocation}`;
        }
      } else {
        passCard.hidden = true;
      }
    }

    if (window.burstPetals) {
      window.burstPetals(window.innerWidth / 2, window.innerHeight / 3, 24);
    }

    done.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "center" });
  }

  const stamp = (d) =>
    new Date(d).toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
  const escapeText = (t) => String(t).replace(/([,;\\])/g, "\\$1").replace(/\n/g, "\\n");

  // One calendar file holding all five functions.
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

  // 1-Click WhatsApp RSVP link builder
  const whatsappRsvpBtn = $("#whatsappRsvpBtn");
  function syncWhatsAppLink() {
    if (!whatsappRsvpBtn) return;
    const names = (form.elements.names && form.elements.names.value.trim()) || "";
    const attendingVal = form.elements.attending ? form.elements.attending.value : "";
    const attendingStr = attendingVal === "no" ? "Regretfully Declines" : "Joyfully Accepts";
    const chosen = eventBoxes.filter((b) => b.checked).map((b) => FIELD_LABELS[b.value] || b.value).join(", ");
    const guests = (form.elements.guests && form.elements.guests.value) || "1";

    let msg = `Namaste Brijesh!\n\nWedding RSVP for Brijesh & Sangeeta:`;
    if (names) msg += `\nName(s): ${names}`;
    if (attendingVal) msg += `\nStatus: ${attendingStr}`;
    if (attendingVal !== "no" && chosen) {
      msg += `\nEvents: ${chosen}\nGuests: ${guests}`;
    }
    msg += `\n\nLooking forward to celebrating at Chandauka!`;
    whatsappRsvpBtn.href = `https://wa.me/919540984699?text=${encodeURIComponent(msg)}`;
  }

  form.addEventListener("input", syncWhatsAppLink);
  form.addEventListener("change", syncWhatsAppLink);
  syncWhatsAppLink();
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
  window.burstPetals = burst;

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

/* ── Royal Wax Seal & Envelope Opening Experience ─────────────── */

(function royalEnvelope() {
  const overlay = $("#envelopeOverlay");
  const breakBtn = $("#breakSealBtn");
  const skipBtn = $("#skipEnvelopeBtn");
  if (!overlay) return;

  function openEnvelope() {
    if (window.burstPetals) {
      window.burstPetals(window.innerWidth / 2, window.innerHeight / 2, 36);
    }
    overlay.classList.add("is-hidden");
    try {
      sessionStorage.setItem("royal_envelope_opened", "1");
    } catch (_) {}
  }

  if (breakBtn) breakBtn.addEventListener("click", openEnvelope);
  if (skipBtn) skipBtn.addEventListener("click", openEnvelope);

  // Check if opened during current session
  try {
    if (sessionStorage.getItem("royal_envelope_opened") === "1") {
      overlay.classList.add("is-hidden");
    }
  } catch (_) {}
})();

/* ── Language Switcher (English / हिन्दी) ───────────────────────── */

(function languageSwitcher() {
  const toggleBtn = $("#langToggle");
  const label = $("#langLabel");
  if (!toggleBtn) return;

  const DICTIONARY = {
    hi: {
      langLabel: "English",
      nav_invite: "शुभ निमंत्रण",
      nav_functions: "कार्यक्रम",
      nav_attire: "पहनावा",
      nav_day: "विवाह दिवस",
      nav_vows: "सप्तपदी",
      nav_travel: "यात्रा व आवास",
      nav_rsvp: "उपस्थिति",
      nav_wishes: "शुभकामनाएं",
      nav_faq: "प्रश्नोत्तर",
      attire_eyebrow: "परिधान एवं रंग विन्यास",
      attire_title: "विवाह उत्सव हेतु उपयुक्त पहनावा",
      attire_sub: "उत्सवों की आभा और रंगीन परंपरा को ध्यान में रखते हुए वस्त्रों का चयन करें।",
      vows_eyebrow: "अग्नि साक्षी · वैदिक परंपरा",
      vows_title: "सप्तपदी — सात पवित्र फेरे एवं प्रतिज्ञाएं",
      vows_sub: "पवित्र अग्नि के समक्ष ब्रिजेश एवं संगीता सात कदम साथ चलकर जन्म-जन्मांतर के पावन बंधन में बंधेंगे।",
      sched_baraat: "बारात",
      sched_milni: "मिलनी",
      sched_jaimala: "जयमाला",
      sched_pherai: "कन्यादान एवं फेरे",
      sched_sindoor: "सिंदूरदान एवं मंगलसूत्र",
      sched_dinner: "प्रीतिभोज",
      sched_vidai: "विदाई",
      wishes_eyebrow: "हार्दिक शुभकामनाएं",
      wishes_title: "वर-वधू को शुभ आशीर्वाद",
      wishes_sub: "ब्रिजेश और संगीता के सुखद दांपत्य जीवन हेतु परिवार की ओर से पावन आशीर्वाद एवं स्नेह भरे संदेश।",
      wishes_banner_title: "अपनी शुभकामनाएं भेजें",
      wishes_banner_sub: "वर-वधू के लिए आपका आशीर्वाद अमूल्य है। डिजिटल पत्रिका पर अपना संदेश लिखें अथवा सीधे व्हाट्सएप पर शुभकामनाएं भेजें।",
      wishes_write_btn: "✍️ शुभकामना संदेश लिखें",
      wishes_wa_btn: "💬 व्हाट्सएप पर भेजें",
      patrika_title: "शुभकामना पत्र",
      patrika_sub: "ब्रिजेश एवं संगीता के लिए अपने आशीर्वाद भरे शब्द लिखें",
      patrika_label_msg: "शुभकामना संदेश",
      patrika_label_author: "शुभचिंतक का नाम व परिवार",
      patrika_label_rel: "रिश्ता या शहर",
      patrika_btn_cancel: "रद्द करें",
      patrika_btn_submit: "✦ आशीर्वाद समर्पित करें",
      gifts_eyebrow: "शगुन एवं आशीष",
      gifts_title: "आपका स्नेह और आशीर्वाद ही सर्वोपरि है",
      gifts_lede: "आपका पावन आगमन ही हमारे लिए सबसे बड़ा उपहार है। यदि आप फिर भी कुछ भेंट करना चाहें, तो नए जीवन के प्रारंभ हेतु आपका स्नेहपूर्वक शगुन हमें अनुगृहीत करेगा।"
    },
    en: {
      langLabel: "हिन्दी",
      nav_invite: "Invitation",
      nav_functions: "Functions",
      nav_attire: "Attire",
      nav_day: "The day",
      nav_vows: "7 Vows",
      nav_travel: "Travel",
      nav_rsvp: "Reply",
      nav_wishes: "Wishes",
      nav_faq: "Questions",
      attire_eyebrow: "Dress code & palette",
      attire_title: "What to wear for each occasion",
      attire_sub: "A guide to colors and traditional attire to help you pack. Above all, choose what makes you feel festive, radiant and comfortable!",
      vows_eyebrow: "Agni Sakshi · Vedic Traditions",
      vows_title: "The Seven Sacred Vows",
      vows_sub: "Around the sacred Agni, Brijesh and Sangeeta will take seven steps together, binding their lives in love, devotion, and lifelong companionship.",
      sched_baraat: "Baraat",
      sched_milni: "Milni",
      sched_jaimala: "Jaimala",
      sched_pherai: "Kanyadaan & Pheras",
      sched_sindoor: "Sindoor & Mangalsutra",
      sched_dinner: "Dinner",
      sched_vidai: "Vidaai",
      wishes_eyebrow: "Heartfelt Blessings",
      wishes_title: "Blessings for the Couple",
      wishes_sub: "Sacred blessings and heartfelt wishes from our beloved family for Brijesh and Sangeeta as they embark on this sacred journey together.",
      wishes_banner_title: "Inscribe Your Blessings",
      wishes_banner_sub: "Your heartfelt words and prayers mean the world to Brijesh & Sangeeta. Inscribe your blessing on this digital patrika or wish them directly on WhatsApp.",
      wishes_write_btn: "✍️ Write a Blessing Card",
      wishes_wa_btn: "💬 Wish on WhatsApp",
      patrika_title: "Royal Blessing Patrika",
      patrika_sub: "Inscribe your words of blessing for Brijesh & Sangeeta",
      patrika_label_msg: "Your Blessing, Prayer or Message",
      patrika_label_author: "Your Name & Family",
      patrika_label_rel: "Relation or City",
      patrika_btn_cancel: "Cancel",
      patrika_btn_submit: "✦ Seal & Post on Wall",
      gifts_eyebrow: "Shagun & Blessings",
      gifts_title: "Your blessings are enough",
      gifts_lede: "Truly. We have a small home, a full shelf of crockery, and no room for another dinner set. If you would still like to give something, a contribution towards our first home would mean the world to us."
    }
  };

  let currentLang = "en";
  try {
    currentLang = localStorage.getItem("lang-brijesh-sangeeta") || "en";
  } catch (_) {}

  function applyLanguage(lang) {
    currentLang = lang;
    try {
      localStorage.setItem("lang-brijesh-sangeeta", lang);
    } catch (_) {}

    const dict = DICTIONARY[lang] || DICTIONARY.en;
    if (label) label.textContent = dict.langLabel;

    $$("[data-i18n]").forEach((el) => {
      const key = el.getAttribute("data-i18n");
      if (dict[key]) {
        el.textContent = dict[key];
      }
    });

    if (typeof window.onLanguageChange === "function") {
      window.onLanguageChange(lang);
    }
  }

  toggleBtn.addEventListener("click", () => {
    const nextLang = currentLang === "en" ? "hi" : "en";
    applyLanguage(nextLang);
  });

  if (currentLang === "hi") {
    applyLanguage("hi");
  }

  window.getCurrentLang = () => currentLang;
})();

/* ── Shubhkamnayein: Wishes & Blessings Wall ───────────────────── */

(function wishesWall() {
  const form = $("#wishesForm");
  const grid = $("#wishesGrid");
  const tagBtns = $$(".blessing-tag-btn");
  const toggleBtn = $("#toggleWishFormBtn");
  const closeBtn = $("#closeWishFormBtn");

  if (!grid) return;

  // Toggle writing card (Sandesh Patrika)
  if (toggleBtn && form) {
    toggleBtn.addEventListener("click", () => {
      const isHidden = form.hasAttribute("hidden");
      if (isHidden) {
        form.removeAttribute("hidden");
        toggleBtn.setAttribute("aria-expanded", "true");
        form.scrollIntoView({ behavior: "smooth", block: "center" });
        const input = $("#wishMessage");
        if (input) setTimeout(() => input.focus(), 300);
      } else {
        form.setAttribute("hidden", "");
        toggleBtn.setAttribute("aria-expanded", "false");
      }
    });
  }

  if (closeBtn && form) {
    closeBtn.addEventListener("click", () => {
      form.setAttribute("hidden", "");
      if (toggleBtn) {
        toggleBtn.setAttribute("aria-expanded", "false");
        toggleBtn.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    });
  }

  let activeTag = "🌸 Eternal Blessings";

  function syncTagLabels(lang) {
    tagBtns.forEach((btn) => {
      const text = lang === "hi" ? btn.dataset.tagHi : btn.dataset.tagEn;
      if (text) btn.textContent = text;
    });
    const activeBtn = $(".blessing-tag-btn.is-active");
    if (activeBtn) {
      activeTag = lang === "hi" ? activeBtn.dataset.tagHi : activeBtn.dataset.tagEn;
    }
  }

  tagBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      tagBtns.forEach((b) => b.classList.remove("is-active"));
      btn.classList.add("is-active");
      const isHi = window.getCurrentLang && window.getCurrentLang() === "hi";
      activeTag = (isHi ? btn.dataset.tagHi : btn.dataset.tagEn) || btn.textContent.trim();
    });
  });

  const WISHES_STORAGE_KEY = "wishes-brijesh-sangeeta-v3";

  const INITIAL_WISHES_EN = [
    {
      author: "Shri Ram Abhilash Yadav & Smt. Anita Yadav",
      relation: "Parents of the Groom",
      tag: "🌸 Eternal Blessings",
      text: "Dearest Brijesh and Sangeeta, may your married life be blessed with profound love, mutual trust, and prosperity. May our kuldevta's divine grace walk beside you in every step.",
      date: "Family Blessings",
    },
    {
      author: "Shri Brijendra Yadav & Smt. Kalawati Devi",
      relation: "Parents of the Bride",
      tag: "🪔 Prayers & Love",
      text: "Our beloved daughter Sangeeta and dear son Brijesh, may joy and abundance always shower upon your home. May your new world together blossom with peace and eternal happiness.",
      date: "Family Blessings",
    },
    {
      author: "Yogesh & Dharmendra",
      relation: "Friends & Brothers",
      tag: "💐 Heartiest Congratulations",
      text: "Bhaiya and Bhabhi, warmest congratulations on your wedding! The tents are pitched, the dhol is ready, and we cannot wait to dance our hearts out and celebrate at Chandauka!",
      date: "Friends & Brothers",
    },
    {
      author: "Anmol, Abhimanyu, Anaika, Aisha & Shanvi",
      relation: "Nephews & Nieces",
      tag: "💍 Best Wishes Forever",
      text: "Heartiest congratulations to our dearest Chacha-Chachi and Mamu-Mami! Wishing you a lifetime of adventures, boundless laughter, and all the happiness in the world!",
      date: "Nephews & Nieces",
    },
  ];

  const INITIAL_WISHES_HI = [
    {
      author: "श्री राम अभिलाष यादव एवं श्रीमती अनिता यादव",
      relation: "माता-पिता (वर पक्ष)",
      tag: "🌸 सदा सुहागन रहो",
      text: "प्रिय ब्रिजेश और संगीता, आप दोनों का दांपत्य जीवन प्रेम, अटूट विश्वास और सुख-समृद्धि से परिपूर्ण रहे। कुलदेवता का पावन आशीर्वाद सदा तुम दोनों पर बना रहे।",
      date: "माता-पिता (वर पक्ष)",
    },
    {
      author: "श्री बृजेन्द्र यादव एवं श्रीमती कलावती देवी",
      relation: "माता-पिता (वधू पक्ष)",
      tag: "🪔 ईश्वर का आशीर्वाद",
      text: "लाडली संगीता और दामाद ब्रिजेश, आपके दांपत्य जीवन में सदैव खुशियों की वर्षा हो। आपका नया संसार हमेशा सुख, शांति और समृद्धि से महकता रहे।",
      date: "माता-पिता (वधू पक्ष)",
    },
    {
      author: "योगेश एवं धर्मेन्द्र",
      relation: "मित्र एवं भाई",
      tag: "💐 ढेरों बधाइयां",
      text: "ब्रिजेश भैया और संगीता भाभी, विवाह के इस पावन अवसर पर ढेरों बधाइयां! बारात में ढोल-नगाड़ों की थाप पर खूब जश्न मनेगा और हम सब दिल खोलकर नाचेंगे!",
      date: "मित्र एवं भाई",
    },
    {
      author: "अनमोल, अभिमन्यु, अनायका, आयशा एवं शान्वी",
      relation: "भतीजे एवं भांजे-भांजी",
      tag: "💍 हार्दिक शुभकामनाएं",
      text: "चाचा-चाची और मामा-मामी को विवाह की हार्दिक शुभकामनाएं! आप दोनों की प्यारी जोड़ी हमेशा सलामत रहे और आपके जीवन में सदा खुशियां और प्यार बना रहे!",
      date: "भतीजे एवं भांजे-भांजी",
    },
  ];

  function getStoredWishes(lang) {
    try {
      const data = localStorage.getItem(`${WISHES_STORAGE_KEY}-${lang}`);
      if (data) {
        const parsed = JSON.parse(data);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (_) {}
    return lang === "hi" ? INITIAL_WISHES_HI : INITIAL_WISHES_EN;
  }

  function saveWishes(list, lang) {
    try {
      localStorage.setItem(`${WISHES_STORAGE_KEY}-${lang}`, JSON.stringify(list));
    } catch (_) {}
  }

  function renderWishes(lang) {
    const activeLanguage = lang || (window.getCurrentLang ? window.getCurrentLang() : "en");
    syncTagLabels(activeLanguage);
    const list = getStoredWishes(activeLanguage);
    grid.innerHTML = "";
    list.forEach((item) => {
      const card = document.createElement("article");
      card.className = "wish-card";
      const isHindi = /[\u0900-\u097F]/.test(item.text);
      card.innerHTML = `
        <div class="wish-card__stamp">${item.tag || "🌸 Blessings"}</div>
        <p class="wish-card__text"${isHindi ? ' lang="hi"' : ""}>“${item.text}”</p>
        <div class="wish-card__author">
          <span class="wish-card__name">${item.author}</span>
          <span class="wish-card__relation">${item.relation || item.date || ""}</span>
        </div>
      `;
      grid.appendChild(card);
    });
  }

  window.onLanguageChange = (newLang) => {
    renderWishes(newLang);
  };

  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const author = $("#wishAuthor").value.trim();
      const relation = $("#wishRelation").value.trim();
      const message = $("#wishMessage").value.trim();

      if (!author || !message) return;

      const currentLang = window.getCurrentLang ? window.getCurrentLang() : "en";
      const newWish = {
        author,
        relation: relation || (currentLang === "hi" ? "शुभचिंतक" : "Well-wisher"),
        tag: activeTag,
        text: message,
        date: currentLang === "hi" ? "अभी-अभी" : "Just now",
      };

      const current = getStoredWishes(currentLang);
      current.unshift(newWish);
      saveWishes(current, currentLang);
      renderWishes(currentLang);

      form.reset();
      tagBtns.forEach((b, i) => b.classList.toggle("is-active", i === 0));
      syncTagLabels(currentLang);

      // Hide the form smoothly after posting
      form.setAttribute("hidden", "");
      if (toggleBtn) toggleBtn.setAttribute("aria-expanded", "false");

      if (window.burstPetals) {
        window.burstPetals(window.innerWidth / 2, window.innerHeight / 2, 28);
      }
    });
  }

  renderWishes(window.getCurrentLang ? window.getCurrentLang() : "en");
})();

/* ── Digital Shagun & WhatsApp Share ───────────────────────────── */

(function shagunAndShare() {
  const copyBtn = $("#copyUpiBtn");
  const upiText = $("#upiIdText");
  const notice = $("#upiCopyNotice");
  const shareBtn = $("#shareInviteBtn");

  if (copyBtn && upiText) {
    copyBtn.addEventListener("click", async () => {
      const id = upiText.textContent.trim();
      try {
        await navigator.clipboard.writeText(id);
        if (notice) notice.textContent = "UPI ID copied to clipboard! / यूपीआई आईडी कॉपी हो गई ✓";
        copyBtn.textContent = "Copied! ✓";
        setTimeout(() => {
          if (notice) notice.textContent = "";
          copyBtn.textContent = "Copy UPI";
        }, 3000);
      } catch (_) {
        if (notice) notice.textContent = `UPI: ${id}`;
      }
    });
  }

  if (shareBtn) {
    shareBtn.addEventListener("click", async () => {
      const title = "Brijesh & Sangeeta — Wedding Invitation";
      const text = "Together with our families, we cordially invite you to celebrate the wedding of Brijesh & Sangeeta Yadav (30 Jan – 2 Feb 2027) at Village Chandauka, Uttar Pradesh. Kindly RSVP and view the functions details here:";
      const url = window.location.href;

      if (navigator.share) {
        try {
          await navigator.share({ title, text, url });
        } catch (_) {}
      } else {
        const waMsg = `${text}\n${url}`;
        window.open(`https://wa.me/?text=${encodeURIComponent(waMsg)}`, "_blank");
      }
    });
  }
})();
