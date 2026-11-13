/* ============================================================
   Brijesh & Sangeeta · Wedding Invitation
   Countdown · navigation · RSVP form
   ============================================================ */

/* ── EDIT ME ───────────────────────────────────────────────────
   Everything a guest-facing change might need lives here.
   ───────────────────────────────────────────────────────────── */

const CONFIG = {
  // Countdown target: the baraat muhurat on Sunday 31 January 2027.
  weddingDate: "2027-01-31T16:00:00+05:30",

  // Wedding Memories & Drive Configuration:
  // Paste Brijesh's Google Drive or Google Photos link here:
  photoDriveUrl: "https://photos.app.goo.gl/brijesh-sangeeta-wedding",

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

  // Serverless email endpoint: sends instant email notifications to Brijesh
  rsvpEndpoint: "https://api.web3forms.com/submit",
  web3FormsKey: "a75fce27-bd6a-4c98-b010-d1a46313f93d",
  rsvpEmail: "ybrijesh.005@gmail.com",

  // Shown on the confirmation card.
  replyByLine: "We can't wait to welcome you to Chandauka.",
};

/* ── Supabase Cloud Configuration (Shared by RSVP & Photo Wall) ─ */
const SUPABASE_CONFIG = {
  url: "https://jkvlilyevdvnaarfgevd.supabase.co",
  anonKey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImprdmxpbHlldmR2bmFhcmZnZXZkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTQ1NTAxODIsImV4cCI6MjExMDEyNjE4Mn0.NXmqOOjAZO2BMwzSLktKePHTMutJQZjbM-iDPyJmNwA",
  bucket: "wedding-photos"
};

/* ── Helpers ─────────────────────────────────────────────────── */

const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/**
 * Robust HTML escaping helper to neutralize XSS in dynamic templates.
 */
function escapeHtml(str) {
  if (str === null || str === undefined) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

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
      setError(lastRadio, "Please select whether you will attend so we can prepare.");
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
      return "We will deeply miss your presence. Thank you for letting us know, and we seek your warm blessings from afar.";
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
          const gTitle = encodeURIComponent("Brijesh & Sangeeta Wedding Celebrations");
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

  window.printWeddingPass = function () {
    document.body.classList.add("printing-pass");
    setTimeout(() => {
      window.print();
    }, 50);
  };

  window.addEventListener("beforeprint", () => {
    const passCard = document.getElementById("weddingPassCard");
    const rsvpDone = document.getElementById("rsvpDone");
    if (rsvpDone && !rsvpDone.hidden && passCard && !passCard.hidden) {
      document.body.classList.add("printing-pass");
    }
  });

  window.addEventListener("afterprint", () => {
    document.body.classList.remove("printing-pass");
  });

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
      "X-WR-CALNAME:Brijesh & Sangeeta Wedding",
    ];

    CONFIG.events.forEach((ev, i) => {
      lines.push(
        "BEGIN:VEVENT",
        `UID:wedding-${ev.name.toLowerCase()}-${i}@brijeshandsangeeta`,
        `DTSTAMP:${stamp(new Date())}`,
        `DTSTART:${stamp(ev.start)}`,
        `DTEND:${stamp(ev.end)}`,
        `SUMMARY:${escapeText(`Brijesh & Sangeeta: ${ev.name}`)}`,
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
      // 1. Submit directly to Web3Forms so Brijesh gets instant email notification on Gmail
      const formData = new FormData(form);
      formData.set("access_key", CONFIG.web3FormsKey || "a75fce27-bd6a-4c98-b010-d1a46313f93d");
      formData.set("from_name", "Brijesh & Sangeeta Wedding RSVP");
      formData.set("name", reply.names);
      formData.set("email", reply.email);
      formData.set("phone", reply.phone || "Not provided");
      formData.set("subject", `Wedding RSVP: ${reply.names} (${reply.attending === "yes" ? "Attending" : "Declined"})`);
      formData.set("attending", reply.attending === "yes" ? "YES (Attending)" : "NO (Regretfully Declining)");
      formData.set("guest_count", reply.attending === "yes" ? (reply.guests || "1") : "0");
      formData.set("functions_attending", reply.attending === "yes"
        ? ((reply.events || []).map((x) => FIELD_LABELS[x] || x).join(", ") || "None")
        : "Will not be attending"
      );
      formData.set("dietary_notes", reply.attending === "yes" ? (reply.diet || "None") : "N/A");
      formData.set("stay_accommodation", reply.attending === "yes" ? (reply.stay || "Not specified") : "N/A");
      formData.set("message", reply.attending === "yes"
        ? (reply.note ? `Note from guest: ${reply.note}` : `Attending with ${reply.guests || 1} guest(s). Looking forward to the wedding!`)
        : (reply.note ? `Regretfully declining. Message for couple: ${reply.note}` : "Regretfully declining the invitation. Sending warmest blessings to Brijesh & Sangeeta from afar.")
      );

      // Background POST to Web3Forms (does not block or open external app)
      fetch(CONFIG.rsvpEndpoint || "https://api.web3forms.com/submit", {
        method: "POST",
        body: formData,
      }).catch((e) => console.warn("Web3Forms background send notice:", e));

      // 2. Direct seamless in-app sync to Supabase in background
      const supabaseRsvpUrl = `${SUPABASE_CONFIG.url}/rest/v1/wedding_rsvps`;
      fetch(supabaseRsvpUrl, {
        method: "POST",
        headers: {
          "apikey": SUPABASE_CONFIG.anonKey,
          "Authorization": `Bearer ${SUPABASE_CONFIG.anonKey}`,
          "Content-Type": "application/json",
          "Prefer": "return=minimal"
        },
        body: JSON.stringify({
          names: reply.names,
          email: reply.email || null,
          phone: reply.phone || null,
          attending: reply.attending,
          events: reply.events,
          guests: reply.guests,
          meal: reply.meal || null,
          diet: reply.diet || null,
          stay: reply.stay || null,
          note: reply.note || null
        })
      }).catch((e) => console.warn("Supabase RSVP sync notice:", e));

      // 3. Configure direct 1-click WhatsApp notification link on the pass
      const notifyBtn = $("#notifyHostWaBtn");
      if (notifyBtn) {
        const eventsList = (reply.events || []).map((x) => FIELD_LABELS[x] || x).join(", ");
        const guestMsg = reply.attending === "yes"
          ? `Namaste Brijesh ji! We have confirmed our RSVP for the wedding celebrations (${reply.names}, ${reply.guests || 1} guest(s), Functions: ${eventsList}). Looking forward to celebrating together at Chandauka!`
          : `Namaste Brijesh ji! We received your wedding invitation (${reply.names}). Sending our warmest blessings to you and Sangeeta!`;
        notifyBtn.href = `https://wa.me/919540984699?text=${encodeURIComponent(guestMsg)}`;
      }

      try {
        localStorage.setItem("rsvp-brijesh-sangeeta", JSON.stringify(reply));
      } catch (_) {
        /* private mode */
      }

      offerCalendar(reply);
      finish(reply);
      // Reset form state so subsequent submissions start with a fresh, clean form
      form.reset();
      eventBoxes.forEach((b) => (b.checked = false));
      if (details) details.classList.remove("is-dimmed");
      status.textContent = "";
    } catch (err) {
      console.warn("RSVP completed with local pass:", err);
      offerCalendar(reply);
      finish(reply);
      form.reset();
      eventBoxes.forEach((b) => (b.checked = false));
      if (details) details.classList.remove("is-dimmed");
      status.textContent = "";
    } finally {
      form.removeAttribute("aria-busy");
      submit.disabled = false;
    }
  });

  $("#rsvpAgain").addEventListener("click", () => {
    form.reset();
    eventBoxes.forEach((b) => (b.checked = false));
    if (details) details.classList.remove("is-dimmed");
    $$(".has-error", form).forEach((el) => el.classList.remove("has-error"));
    $$("[data-error-for]", form).forEach((el) => (el.textContent = ""));
    try {
      localStorage.removeItem("rsvp-brijesh-sangeeta");
    } catch (_) {}
    done.hidden = true;
    form.hidden = false;
    form.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
    if (form.elements.names) form.elements.names.focus();
  });

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
   a finger or a cursor; touching the page should feel like
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

  // Lock scrolling while envelope is shown
  document.body.classList.add("has-envelope");

  function openEnvelope() {
    document.body.classList.remove("has-envelope");
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
      document.body.classList.remove("has-envelope");
      overlay.classList.add("is-hidden");
    }
  } catch (_) {}
})();

/* ── Language Switcher (English / हिन्दी) ───────────────────────── */

(function languageSwitcher() {
  const toggleBtn = $("#langToggle");
  const mobileToggleBtn = $("#mobileLangToggle");
  const label = $("#langLabel");
  const mLabel = $("#mobileLangLabel");

  const DICTIONARY = {
    hi: {
      langLabel: "English",
      mobileLangLabel: "Switch to English",
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
      vows_title: "सप्तपदी: सात पवित्र फेरे एवं वैदिक प्रतिज्ञाएं",
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
      wishes_write_btn: "शुभकामना संदेश लिखें",
      wishes_wa_btn: "व्हाट्सएप पर भेजें",
      rsvp_wa_btn: "व्हाट्सएप पर तुरंत उत्तर दें",
      patrika_title: "शुभकामना पत्र",
      patrika_sub: "ब्रिजेश एवं संगीता के लिए अपने आशीर्वाद भरे शब्द लिखें",
      patrika_label_msg: "शुभकामना संदेश",
      patrika_label_author: "शुभचिंतक का नाम व परिवार",
      patrika_label_rel: "रिश्ता या शहर",
      patrika_btn_cancel: "रद्द करें",
      patrika_btn_submit: "✦ आशीर्वाद समर्पित करें",
      nav_memories: "एलबम",
      memories_eyebrow: "स्मृतियां संजोएं",
      memories_title: "विवाह स्मृतियां एवं फोटो एलबम",
      memories_sub: "क्या आपने विवाह उत्सव के पावन पलों, बारात या रस्मों की तस्वीरें या वीडियो लिए हैं? क्यूआर कोड स्कैन करें या नीचे दिए बटन से अपनी तस्वीरें एलबम में साझा करें!",
      memories_qr_label: "मोबाइल कैमरे से स्कैन करें",
      memories_heading: "ब्रिजेश एवं संगीता का साझा फोटो एलबम",
      memories_desc: "हल्दी, मंडप, बारात या फेरों के दौरान आपके द्वारा खींची गई सुंदर तस्वीरें और वीडियो हमारे इस साझा परिवार एलबम में अवश्य अपलोड करें!",
      memories_upload_btn: "तस्वीरें एवं वीडियो अपलोड करें",
      memories_view_btn: "विवाह एलबम एवं लाइव वॉल देखें",
      memories_note: "✦ सभी परिजनों व मित्रों के लिए खुला &middot; अपनी तस्वीरें मूल उच्च गुणवत्ता (Original Resolution) में अपलोड करें।",
      pwa_save_app: "ऐप सेव करें",
      upload_modal_title: "विवाह की स्मृतियां साझा करें",
      upload_modal_sub: "स्मार्ट कंप्रेसर सक्रिय है: आपकी तस्वीरें स्वतः उच्च गुणवत्ता में कंप्रेस होकर शीघ्र अपलोड होंगी।",
      upload_guest_label: "आपका नाम / परिवार (वैकल्पिक)",
      upload_dropzone_title: "तस्वीरें या वीडियो चुनने के लिए यहां टैप करें",
      upload_dropzone_hint: "मोबाइल कैमरा या गैलरी से · एक साथ कई तस्वीरें चुनी जा सकती हैं",
      compression_status: "तस्वीरों का आकार अनुकूलित हो रहा है...",
      upload_confirm_btn: "विवाह वॉल में जोड़ें",
      upload_drive_alt: "गूगल ड्राइव पसंद है? ",
      upload_drive_link: "सीधे ड्राइव एलबम खोलें →",
      photowall_title: "विवाह की सजीव स्मृतियां वॉल",
      slideshow_start: "स्लाइड शो (प्रोजेक्टर मोड)",
      wall_upload_btn: "+ अपनी तस्वीरें जोड़ें",
      gifts_eyebrow: "शगुन एवं आशीष",
      gifts_title: "आपका स्नेह और आशीर्वाद ही सर्वोपरि है",
      shagun_title: "शगुन",
      gifts_share_btn: "व्हाट्सएप पर साझा करें",
      hero_rsvp: "व्हाट्सएप पर उपस्थिति दर्ज करें",
      hero_invitation: "शुभ निमंत्रण पत्र",
      travel_open_maps: "गूगल मैप्स में देखें",
      rsvp_submit: "उपस्थिति पुष्टि करें",
      rsvp_edit: "उपस्थिति विवरण बदलें",
      rsvp_another: "एक और उपस्थिति दर्ज करें",
      weather_eyebrow: "प्रतापगढ़ का मौसम &middot; रियल-टाइम",
      weather_live_tag: "लाइव",
      weather_subtext: "प्रतापगढ़ का वर्तमान मौसम। जनवरी अंत में होने वाले वैवाहिक आयोजनों में दिन में खिली धूप (21°C) तथा शाम को खुशनुमा ठंडक (8°C) रहेगी। शाम को अलाव व गरमा-गरम चाय की व्यवस्था रहेगी!",
      family_eyebrow: "परिवार एवं स्नेही स्वजन",
      family_elders_label: "अग्रज एवं भ्रातृवृंद (दर्शनाभिलाषी)",
      family_friends_label: "स्नेही स्वजन व मित्र",
      family_kids_label: "बाल मनुहार (भतीजे एवं भांजे-भांजी)",
      gifts_lede: "आपका पावन आगमन ही हमारे लिए सबसे बड़ा उपहार है। यदि आप फिर भी कुछ भेंट करना चाहें, तो नए जीवन के प्रारंभ हेतु आपका स्नेहपूर्वक शगुन हमें अनुगृहीत करेगा।"
    },
    en: {
      langLabel: "हिन्दी",
      mobileLangLabel: "Switch to हिन्दी",
      nav_invite: "Invitation",
      nav_functions: "Functions",
      nav_attire: "Attire",
      nav_day: "The day",
      nav_vows: "7 Vows",
      nav_travel: "Travel",
      nav_rsvp: "Reply",
      nav_wishes: "Wishes",
      nav_memories: "Album",
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
      family_eyebrow: "With the Blessings of Our Family",
      family_elders_label: "Elder Brothers & Brothers",
      family_friends_label: "Friends & Well-Wishers",
      family_kids_label: "Our Little Blessings (Nieces & Nephews)",
      wishes_eyebrow: "Heartfelt Blessings",
      wishes_title: "Blessings for the Couple",
      wishes_sub: "Sacred blessings and heartfelt wishes from our beloved family for Brijesh and Sangeeta as they embark on this sacred journey together.",
      wishes_banner_title: "Inscribe Your Blessings",
      wishes_banner_sub: "Your heartfelt words and prayers mean the world to Brijesh & Sangeeta. Inscribe your blessing on this digital patrika or wish them directly on WhatsApp.",
      wishes_write_btn: "Write a Blessing Card",
      wishes_wa_btn: "Wish on WhatsApp",
      rsvp_wa_btn: "1-Click RSVP on WhatsApp",
      patrika_title: "Royal Blessing Patrika",
      patrika_sub: "Inscribe your words of blessing for Brijesh & Sangeeta",
      patrika_label_msg: "Your Blessing, Prayer or Message",
      patrika_label_author: "Your Name & Family",
      patrika_label_rel: "Relation or City",
      patrika_btn_cancel: "Cancel",
      patrika_btn_submit: "✦ Seal & Post on Wall",
      memories_eyebrow: "Capture & Relive",
      memories_title: "Wedding Memories & Album",
      memories_sub: "Did you capture candid moments, selfies, or dance videos during the wedding? Scan the QR code or click below to upload your clicks to the family album, or browse official wedding photos!",
      memories_qr_label: "Scan with Phone Camera",
      memories_heading: "Brijesh & Sangeeta's Shared Album",
      memories_desc: "Whether you took candids at the Tilak, selfies at the Mandap, or energetic videos in the Baraat, please share your memories with us!",
      memories_upload_btn: "Upload Photos & Videos",
      memories_view_btn: "View Live Wedding Wall",
      memories_note: "✦ Open for all guests &middot; Upload your original full-resolution photos directly.",
      pwa_save_app: "Save App",
      upload_modal_title: "Upload Wedding Memories",
      upload_modal_sub: "Built-in smart compression instantly optimizes high-res camera photos for fast, smooth uploads.",
      upload_guest_label: "Your Name / Family (Optional)",
      upload_dropzone_title: "Click or Tap to Select Photos & Videos",
      upload_dropzone_hint: "From phone camera or gallery · Multiple photos supported",
      compression_status: "Optimizing photos for village network...",
      upload_confirm_btn: "Add to Live Wedding Wall",
      upload_drive_alt: "Prefer Google Drive? ",
      upload_drive_link: "Open Drive album directly →",
      photowall_title: "Live Wedding Memories Wall",
      slideshow_start: "Slideshow (Projector Mode)",
      wall_upload_btn: "+ Upload Photos",
      gifts_eyebrow: "Shagun & Blessings",
      gifts_title: "Your blessings are enough",
      shagun_title: "Digital Shagun",
      gifts_share_btn: "Share on WhatsApp",
      hero_rsvp: "RSVP on WhatsApp",
      hero_invitation: "View Invitation",
      travel_open_maps: "Open in Google Maps",
      rsvp_submit: "Confirm RSVP & Get Pass",
      rsvp_edit: "Edit RSVP",
      rsvp_another: "Submit Another RSVP",
      weather_eyebrow: "Pratapgarh Weather &middot; Real-Time",
      weather_live_tag: "Live",
      weather_subtext: "Real-time conditions in Pratapgarh. For wedding week in late January, expect pleasant sunny afternoons (21°C) and crisp starry village evenings (8°C). Bonfires and hot spiced chai await you!",
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
    if (mLabel) mLabel.textContent = dict.mobileLangLabel;

    $$("[data-i18n]").forEach((el) => {
      const key = el.getAttribute("data-i18n");
      if (dict[key]) {
        el.textContent = dict[key];
      }
    });

    if (typeof window.onLanguageChange === "function") {
      window.onLanguageChange(lang);
    }
    try {
      window.dispatchEvent(new CustomEvent("weddingLangChange", { detail: { lang } }));
    } catch (_) {}
  }

  const allToggles = [toggleBtn, mobileToggleBtn].filter(Boolean);
  allToggles.forEach((btn) => {
    btn.addEventListener("click", () => {
      const nextLang = currentLang === "en" ? "hi" : "en";
      applyLanguage(nextLang);
    });
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

  let activeTag = "✦ Eternal Blessings";

  function syncTagLabels(lang) {
    tagBtns.forEach((btn) => {
      const text = lang === "hi" ? btn.dataset.tagHi : btn.dataset.tagEn;
      if (text) {
        btn.innerHTML = `<span>✦</span> <span class="tag-txt">${text}</span>`;
      }
    });
    const activeBtn = $(".blessing-tag-btn.is-active");
    if (activeBtn) {
      const activeText = lang === "hi" ? activeBtn.dataset.tagHi : activeBtn.dataset.tagEn;
      activeTag = `✦ ${activeText}`;
    }
  }

  tagBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      tagBtns.forEach((b) => b.classList.remove("is-active"));
      btn.classList.add("is-active");
      const isHi = window.getCurrentLang && window.getCurrentLang() === "hi";
      const rawText = (isHi ? btn.dataset.tagHi : btn.dataset.tagEn) || btn.textContent.trim().replace(/^✦\s*/, "");
      activeTag = `✦ ${rawText}`;
    });
  });

  const WISHES_STORAGE_KEY = "wishes-brijesh-sangeeta-v5";

  const INITIAL_WISHES_EN = [
    {
      author: "Shri Ram Abhilash Yadav & Smt. Anita Yadav",
      relation: "Parents of the Groom",
      tag: "✦ Eternal Blessings",
      text: "Dearest Brijesh and Sangeeta, may your married life be blessed with profound love, mutual trust, and prosperity. May our kuldevta's divine grace walk beside you in every step.",
      date: "Family Blessings",
    },
    {
      author: "Shri Brijendra Yadav & Smt. Kalawati Devi",
      relation: "Parents of the Bride",
      tag: "✦ Prayers & Love",
      text: "Our beloved daughter Sangeeta and dear son Brijesh, may joy and abundance always shower upon your home. May your new world together blossom with peace and eternal happiness.",
      date: "Family Blessings",
    },
    {
      author: "J.P. Bhaiya, Abhishek, Ajeet, Vineet, Satya Prakash & Amit",
      relation: "Elder Brothers & Brothers",
      tag: "✦ Eternal Blessings",
      text: "Dearest Brijesh and Sangeeta, may your married life blossom with deep happiness, prosperity, and togetherness. As brothers, we are always by your side to celebrate every milestone of this beautiful new journey!",
      date: "Brothers' Blessings",
    },
    {
      author: "Yogesh & Dharmendra",
      relation: "Friends & Well-Wishers",
      tag: "✦ Heartiest Congratulations",
      text: "Brijesh and Sangeeta Bhabhi, heartiest congratulations! The Baraat is going to be unforgettable, the dhol is waiting, and we can't wait to dance our hearts out and celebrate together in Chandauka!",
      date: "Friends",
    },
    {
      author: "Anmol, Abhimanyu, Krishna, Avyansh, Anaika, Aisha, Shanvi, Sudha & Aditi",
      relation: "Nieces & Nephews (Bal-Gopal)",
      tag: "✦ Best Wishes Forever",
      text: "Heartiest congratulations to our dearest Chacha-Chachi and Mamu-Mami! Wishing you a lifetime of adventures, boundless laughter, and all the happiness in the world!",
      date: "Nieces & Nephews",
    },
  ];

  const INITIAL_WISHES_HI = [
    {
      author: "श्री राम अभिलाष यादव एवं श्रीमती अनिता यादव",
      relation: "माता-पिता (वर पक्ष)",
      tag: "✦ सदा सुहागन रहो",
      text: "प्रिय ब्रिजेश और संगीता, आप दोनों का दांपत्य जीवन प्रेम, अटूट विश्वास और सुख-समृद्धि से परिपूर्ण रहे। कुलदेवता का पावन आशीर्वाद सदा तुम दोनों पर बना रहे।",
      date: "माता-पिता (वर पक्ष)",
    },
    {
      author: "श्री बृजेन्द्र यादव एवं श्रीमती कलावती देवी",
      relation: "माता-पिता (वधू पक्ष)",
      tag: "✦ ईश्वर का आशीर्वाद",
      text: "लाडली संगीता और दामाद ब्रिजेश, आपके दांपत्य जीवन में सदैव खुशियों की वर्षा हो। आपका नया संसार हमेशा सुख, शांति और समृद्धि से महकता रहे।",
      date: "माता-पिता (वधू पक्ष)",
    },
    {
      author: "जे.पी. भैया, अभिषेक, अजीत, विनीत, सत्य प्रकाश एवं अमित",
      relation: "अग्रज एवं भ्रातृवृंद",
      tag: "✦ अग्रज स्नेह व आशीर्वाद",
      text: "प्रिय ब्रिजेश और संगीता, आप दोनों का दांपत्य जीवन सदैव प्रेम, सौहार्द और खुशहाली से महकता रहे। भाइयों का स्नेह और आशीर्वाद हर कदम पर तुम दोनों के साथ है। नए जीवन की हार्दिक शुभकामनाएं!",
      date: "पारिवारिक आशीर्वाद",
    },
    {
      author: "योगेश एवं धर्मेन्द्र",
      relation: "मित्र",
      tag: "✦ ढेरों बधाइयां",
      text: "ब्रिजेश और संगीता भाभी, विवाह के इस शुभ अवसर पर दिल से बहुत-बहुत बधाई! बारात में ढोल-नगाड़ों की धुन पर जमकर जश्न मनेगा और हम दोस्त मिलकर चन्दौका में यादगार महफ़िल सजाएंगे!",
      date: "मित्र",
    },
    {
      author: "अनमोल, अभिमन्यु, कृष्णा, अव्यांश, अनायका, आयशा, शान्वी, सुधा एवं अदिति",
      relation: "बाल मनुहार (भतीजे एवं भांजे-भांजी)",
      tag: "✦ हार्दिक शुभकामनाएं",
      text: "चाचा-चाची और मामा-मामी को विवाह की ढेरों शुभकामनाएं! आप दोनों की प्यारी जोड़ी हमेशा मुस्कुराती रहे, और हम सब बच्चे शादी में खूब मस्ती और धमाल मचाएंगे!",
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
      const safeTag = escapeHtml(item.tag || "✦ Blessings");
      const safeText = escapeHtml(item.text);
      const safeAuthor = escapeHtml(item.author);
      const safeRelation = escapeHtml(item.relation || item.date || "");
      card.innerHTML = `
        <div class="wish-card__stamp">${safeTag}</div>
        <p class="wish-card__text"${isHindi ? ' lang="hi"' : ""}>“${safeText}”</p>
        <div class="wish-card__author">
          <span class="wish-card__name">${safeAuthor}</span>
          <span class="wish-card__relation">${safeRelation}</span>
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
      const title = "Brijesh & Sangeeta: Wedding Invitation";
      const text = "Together with our families, we cordially invite you to celebrate the wedding of Brijesh & Sangeeta Yadav (30 Jan - 2 Feb 2027) at Village Chandauka, Uttar Pradesh. Kindly RSVP and view the functions details here:";
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

/* ── Wedding Memories & QR Code Generator ─────────────────────── */

const QRGenerator = (function() {
  const EXP = new Uint8Array(512);
  const LOG = new Uint8Array(256);
  let x = 1;
  for (let i = 0; i < 255; i++) {
    EXP[i] = x;
    EXP[i + 255] = x;
    LOG[x] = i;
    x = (x << 1) ^ (x >= 128 ? 0x11d : 0);
  }

  function gfMul(x, y) {
    return (x === 0 || y === 0) ? 0 : EXP[LOG[x] + LOG[y]];
  }

  function polyMul(p1, p2) {
    const res = new Uint8Array(p1.length + p2.length - 1);
    for (let i = 0; i < p1.length; i++) {
      for (let j = 0; j < p2.length; j++) {
        res[i + j] ^= gfMul(p1[i], p2[j]);
      }
    }
    return res;
  }

  function rsGenPoly(n) {
    let g = new Uint8Array([1]);
    for (let i = 0; i < n; i++) {
      g = polyMul(g, new Uint8Array([1, EXP[i]]));
    }
    return g;
  }

  function rsCompute(data, ecCount) {
    const gen = rsGenPoly(ecCount);
    const msg = new Uint8Array(data.length + ecCount);
    msg.set(data);
    for (let i = 0; i < data.length; i++) {
      const coef = msg[i];
      if (coef !== 0) {
        for (let j = 0; j < gen.length; j++) {
          msg[i + j] ^= gfMul(gen[j], coef);
        }
      }
    }
    return msg.subarray(data.length);
  }

  const VERSIONS = [
    null,
    { ver: 1, size: 21, dataCap: 19, ecCount: 7, align: [] },
    { ver: 2, size: 25, dataCap: 34, ecCount: 10, align: [6, 18] },
    { ver: 3, size: 29, dataCap: 55, ecCount: 15, align: [6, 22] },
    { ver: 4, size: 33, dataCap: 80, ecCount: 20, align: [6, 26] },
    { ver: 5, size: 37, dataCap: 108, ecCount: 26, align: [6, 30] },
    { ver: 6, size: 41, dataCap: 136, ecCount: 28, align: [6, 34] },
    { ver: 7, size: 45, dataCap: 156, ecCount: 30, align: [6, 22, 38] }
  ];

  function getVersion(len) {
    for (let v = 1; v < VERSIONS.length; v++) {
      if (len + 3 <= VERSIONS[v].dataCap) return VERSIONS[v];
    }
    return VERSIONS[VERSIONS.length - 1];
  }

  function encodeData(text, vInfo) {
    const bytes = new TextEncoder().encode(text);
    const bits = [];
    function push(val, len) {
      for (let i = len - 1; i >= 0; i--) bits.push((val >> i) & 1);
    }
    push(0b0100, 4);
    push(bytes.length, 8);
    for (let b of bytes) push(b, 8);
    const padLen = vInfo.dataCap * 8;
    while (bits.length < padLen && bits.length % 8 !== 0) bits.push(0);
    while (bits.length < padLen && bits.length < padLen - 4) push(0, 4);

    const dataBytes = new Uint8Array(vInfo.dataCap);
    for (let i = 0; i < bits.length; i += 8) {
      let b = 0;
      for (let j = 0; j < 8; j++) b = (b << 1) | (bits[i + j] || 0);
      dataBytes[i / 8] = b;
    }
    const padPatterns = [0xec, 0x11];
    let pIdx = 0;
    for (let i = Math.floor(bits.length / 8); i < vInfo.dataCap; i++) {
      dataBytes[i] = padPatterns[pIdx++ % 2];
    }
    return dataBytes;
  }

  function createMatrix(vInfo, dataWithEc) {
    const N = vInfo.size;
    const matrix = Array.from({ length: N }, () => new Int8Array(N).fill(-1));

    function placeFinder(row, col) {
      for (let r = -1; r <= 7; r++) {
        for (let c = -1; c <= 7; c++) {
          const mr = row + r, mc = col + c;
          if (mr < 0 || mr >= N || mc < 0 || mc >= N) continue;
          if ((r >= 0 && r <= 6 && (c === 0 || c === 6)) ||
              (c >= 0 && c <= 6 && (r === 0 || r === 6)) ||
              (r >= 2 && r <= 4 && c >= 2 && c <= 4)) {
            matrix[mr][mc] = 1;
          } else {
            matrix[mr][mc] = 0;
          }
        }
      }
    }
    placeFinder(0, 0);
    placeFinder(0, N - 7);
    placeFinder(N - 7, 0);

    for (let i = 8; i < N - 8; i++) {
      if (matrix[6][i] === -1) matrix[6][i] = (i % 2 === 0 ? 1 : 0);
      if (matrix[i][6] === -1) matrix[i][6] = (i % 2 === 0 ? 1 : 0);
    }

    if (vInfo.align.length > 0) {
      for (let r of vInfo.align) {
        for (let c of vInfo.align) {
          if (matrix[r][c] !== -1) continue;
          for (let dr = -2; dr <= 2; dr++) {
            for (let dc = -2; dc <= 2; dc++) {
              const d = Math.max(Math.abs(dr), Math.abs(dc));
              matrix[r + dr][c + dc] = (d === 1 ? 0 : 1);
            }
          }
        }
      }
    }

    matrix[4 * vInfo.ver + 9][8] = 1;

    for (let i = 0; i < 9; i++) {
      if (matrix[8][i] === -1) matrix[8][i] = 0;
      if (matrix[i][8] === -1) matrix[i][8] = 0;
    }
    for (let i = N - 8; i < N; i++) {
      if (matrix[8][i] === -1) matrix[8][i] = 0;
      if (matrix[i][8] === -1) matrix[i][8] = 0;
    }

    let bitIdx = 0;
    const allBits = [];
    for (let b of dataWithEc) {
      for (let i = 7; i >= 0; i--) allBits.push((b >> i) & 1);
    }

    let right = N - 1;
    let upward = true;
    while (right > 0) {
      if (right === 6) right--;
      for (let vert = 0; vert < N; vert++) {
        const r = upward ? (N - 1 - vert) : vert;
        for (let c = right; c >= right - 1; c--) {
          if (matrix[r][c] === -1) {
            const val = bitIdx < allBits.length ? allBits[bitIdx++] : 0;
            const mask = ((r + c) % 2 === 0) ? 1 : 0;
            matrix[r][c] = val ^ mask;
          }
        }
      }
      upward = !upward;
      right -= 2;
    }

    const fmtBits = [1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 0, 0, 1, 0, 0];
    const fmtPos1 = [[8,0],[8,1],[8,2],[8,3],[8,4],[8,5],[8,7],[8,8],[7,8],[5,8],[4,8],[3,8],[2,8],[1,8],[0,8]];
    for (let i = 0; i < 15; i++) {
      matrix[fmtPos1[i][0]][fmtPos1[i][1]] = fmtBits[i];
    }
    for (let i = 0; i < 7; i++) matrix[N - 1 - i][8] = fmtBits[i];
    for (let i = 7; i < 15; i++) matrix[8][N - 15 + i] = fmtBits[i];

    return matrix;
  }

  function toSVG(text, size = 150) {
    const vInfo = getVersion(new TextEncoder().encode(text).length);
    const dataBytes = encodeData(text, vInfo);
    const ecBytes = rsCompute(dataBytes, vInfo.ecCount);
    const fullData = new Uint8Array(dataBytes.length + ecBytes.length);
    fullData.set(dataBytes);
    fullData.set(ecBytes, dataBytes.length);

    const matrix = createMatrix(vInfo, fullData);
    const N = matrix.length;
    const margin = 2;
    const total = N + margin * 2;

    let path = "";
    for (let r = 0; r < N; r++) {
      for (let c = 0; c < N; c++) {
        if (matrix[r][c] === 1) {
          path += `M${c + margin},${r + margin}h1v1h-1z `;
        }
      }
    }
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${total} ${total}" width="${size}" height="${size}" shape-rendering="crispEdges" aria-label="QR Code to Wedding Album">
      <rect width="100%" height="100%" fill="#ffffff" />
      <path d="${path}" fill="#3b1a17" />
    </svg>`;
  }

  return { toSVG };
})();

/* ── Memories, Client-Side 4G Image Compressor & Live Photo Wall ── */

(function initMemoriesAndMediaPipeline() {
  const qrBox = $("#memoriesQrBox");
  const uploadBtn = $("#uploadPhotosBtn");
  const viewBtn = $("#viewAlbumBtn");
  const driveUrl = (CONFIG && CONFIG.photoDriveUrl) || "https://photos.app.goo.gl/brijesh-sangeeta-wedding";

  // QR Code Generation
  if (qrBox && typeof QRGenerator !== "undefined") {
    try {
      const seal = qrBox.querySelector(".qr-center-seal");
      qrBox.innerHTML = QRGenerator.toSVG(driveUrl, 150);
      if (seal) qrBox.appendChild(seal);
    } catch (err) {
      console.warn("QR generator fallback:", err);
    }
  }

  // Modals & Wall Controls
  const uploadModal = $("#uploadModal");
  const photoWallModal = $("#photoWallModal");
  const modalDriveLink = $("#modalDriveLink");
  if (modalDriveLink) modalDriveLink.href = driveUrl;

  const wallGrid = $("#weddingWallGrid");
  const slideshowView = $("#slideshowView");
  const slideshowActiveSlide = $("#slideshowActiveSlide");
  const slideshowCounter = $("#slideshowCounter");
  const startSlideshowBtn = $("#startSlideshowBtn");
  const closeSlideshowBtn = $("#closeSlideshowBtn");
  const slideshowPlayToggle = $("#slideshowPlayToggle");
  const slideshowPrevBtn = $("#slideshowPrevBtn");
  const slideshowNextBtn = $("#slideshowNextBtn");
  const slideshowFullscreenBtn = $("#slideshowFullscreenBtn");
  const slideshowDownloadBtn = $("#slideshowDownloadBtn");
  const slideshowDeleteBtn = $("#slideshowDeleteBtn");
  const toggleSlideshowVisibilityBtn = $("#toggleSlideshowVisibilityBtn");

  function openModal(modal) {
    if (!modal) return;
    modal.classList.add("is-open");
    modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }

  function closeModal(modal) {
    if (!modal) return;
    modal.classList.remove("is-open");
    modal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    if (modal === photoWallModal && stopSlideshow) {
      stopSlideshow();
    }
  }

  // Modal triggers & close buttons
  document.querySelectorAll("[data-close-modal]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const targetId = btn.getAttribute("data-close-modal");
      closeModal(document.getElementById(targetId));
    });
  });

  if (uploadBtn) {
    uploadBtn.addEventListener("click", (e) => {
      e.preventDefault();
      openModal(uploadModal);
    });
  }

  if (viewBtn) {
    viewBtn.addEventListener("click", async (e) => {
      e.preventDefault();
      openModal(photoWallModal);
      if (slideshowView) slideshowView.style.display = "block";
      await renderPhotoWall();
      startSlideshowAt(0);
    });
  }

  const openUploadFromWallBtn = $("#openUploadFromWallBtn");
  if (openUploadFromWallBtn) {
    openUploadFromWallBtn.addEventListener("click", () => {
      closeModal(photoWallModal);
      openModal(uploadModal);
    });
  }

  // Escape key closes open modals
  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      if (uploadModal && uploadModal.classList.contains("is-open")) closeModal(uploadModal);
      if (photoWallModal && photoWallModal.classList.contains("is-open")) closeModal(photoWallModal);
    }
  });

  /* ── Client-Side Smart Image Compressor ──────────────────────── */
  const dropzone = $("#mediaDropzone");
  const fileInput = $("#mediaFileInput");
  const mediaStagedSection = $("#mediaStagedSection");
  const stagedCount = $("#stagedCount");
  const addMorePhotosBtn = $("#addMorePhotosBtn");
  const compressionStatus = $("#compressionStatus");
  const compressionLabel = $("#compressionLabel");
  const compressionSavingsBadge = $("#compressionSavingsBadge");
  const compressionBarFill = $("#compressionBarFill");
  const compressionMetric = $("#compressionMetric");
  const previewsContainer = $("#mediaPreviews");
  const confirmUploadBtn = $("#confirmUploadBtn");
  const guestNameInput = $("#mediaGuestName");

  let stagedFiles = []; // { file, compressedDataUrl, originalSize, compressedSize, name }

  if (addMorePhotosBtn && fileInput) {
    addMorePhotosBtn.addEventListener("click", () => fileInput.click());
  }

  if (dropzone && fileInput) {
    dropzone.addEventListener("click", () => fileInput.click());
    dropzone.addEventListener("dragover", (e) => {
      e.preventDefault();
      dropzone.classList.add("is-dragover");
    });
    dropzone.addEventListener("dragleave", () => {
      dropzone.classList.remove("is-dragover");
    });
    dropzone.addEventListener("drop", (e) => {
      e.preventDefault();
      dropzone.classList.remove("is-dragover");
      if (e.dataTransfer && e.dataTransfer.files.length) {
        processFiles(Array.from(e.dataTransfer.files));
      }
    });

    fileInput.addEventListener("change", () => {
      if (fileInput.files.length) {
        processFiles(Array.from(fileInput.files));
      }
    });
  }

  function formatBytes(bytes) {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  }

  async function compressSingleImage(file, maxDimension = 1920, quality = 0.82) {
    if (!file.type.startsWith("image/")) {
      return {
        name: file.name,
        originalSize: file.size,
        compressedSize: file.size,
        dataUrl: null,
        savingsPct: 0
      };
    }

    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          let { width, height } = img;
          if (width > maxDimension || height > maxDimension) {
            if (width > height) {
              height = Math.round((height * maxDimension) / width);
              width = maxDimension;
            } else {
              width = Math.round((width * maxDimension) / height);
              height = maxDimension;
            }
          }

          const canvas = document.createElement("canvas");
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0, width, height);

          // Try WebP first, fallback to JPEG
          canvas.toBlob((blob) => {
            if (blob) {
              const dataUrl = canvas.toDataURL("image/webp", quality);
              const savings = Math.max(0, Math.round(((file.size - blob.size) / file.size) * 100));
              resolve({
                name: file.name.replace(/\.[^/.]+$/, ".webp"),
                originalSize: file.size,
                compressedSize: blob.size,
                blob: blob,
                dataUrl: dataUrl,
                savingsPct: savings
              });
            } else {
              canvas.toBlob((jpegBlob) => {
                const dataUrl = canvas.toDataURL("image/jpeg", quality);
                const size = jpegBlob ? jpegBlob.size : file.size;
                const savings = Math.max(0, Math.round(((file.size - size) / file.size) * 100));
                resolve({
                  name: file.name,
                  originalSize: file.size,
                  compressedSize: size,
                  blob: jpegBlob || file,
                  dataUrl: dataUrl,
                  savingsPct: savings
                });
              }, "image/jpeg", quality);
            }
          }, "image/webp", quality);
        };
        img.onerror = () => {
          resolve({
            name: file.name,
            originalSize: file.size,
            compressedSize: file.size,
            blob: file,
            dataUrl: null,
            savingsPct: 0
          });
        };
        img.src = e.target.result;
      };
      reader.onerror = () => {
        resolve({
          name: file.name,
          originalSize: file.size,
          compressedSize: file.size,
          blob: file,
          dataUrl: null,
          savingsPct: 0
        });
      };
      reader.readAsDataURL(file);
    });
  }

  const ALLOWED_MEDIA_EXTS = new Set(["jpg", "jpeg", "png", "webp", "heic", "heif", "mp4", "mov", "webm", "m4v"]);
  const BLOCKED_MEDIA_EXTS = new Set([
    "bat", "cmd", "exe", "msi", "scr", "sh", "bash", "php", "phtml",
    "pl", "py", "js", "mjs", "vbs", "ps1", "svg", "html", "htm", "dll",
    "jar", "app", "apk", "com", "bin"
  ]);
  const MAX_FILE_SIZE_BYTES = 50 * 1024 * 1024; // 50MB max

  async function processFiles(files) {
    if (!files || !files.length) return;

    // Strict client-side security filtering against executables, scripts, SVGs & oversize files
    const validFiles = [];
    let blockedCount = 0;

    for (const f of files) {
      const ext = (f.name ? f.name.split('.').pop() : '').toLowerCase();
      const isMimeAllowed = f.type ? (f.type.startsWith("image/") || f.type.startsWith("video/")) : true;
      const isSvg = ext === "svg" || f.type === "image/svg+xml";

      if (BLOCKED_MEDIA_EXTS.has(ext) || isSvg || !ALLOWED_MEDIA_EXTS.has(ext) || !isMimeAllowed) {
        blockedCount++;
        continue;
      }
      if (f.size > MAX_FILE_SIZE_BYTES) {
        blockedCount++;
        continue;
      }
      validFiles.push(f);
    }

    if (blockedCount > 0) {
      alert("Security Notice: Only standard wedding photos & videos (JPG, PNG, WebP, MP4) under 50MB are permitted. Unsupported or executable files were ignored.");
    }

    if (!validFiles.length) {
      if (confirmUploadBtn) confirmUploadBtn.disabled = stagedFiles.length === 0;
      return;
    }

    if (compressionStatus) compressionStatus.style.display = "block";
    if (confirmUploadBtn) confirmUploadBtn.disabled = true;

    let totalOrig = stagedFiles.reduce((acc, f) => acc + f.originalSize, 0);
    let totalComp = stagedFiles.reduce((acc, f) => acc + f.compressedSize, 0);

    for (let i = 0; i < validFiles.length; i++) {
      const f = validFiles[i];
      const pct = Math.round(((i + 1) / validFiles.length) * 100);
      if (compressionBarFill) compressionBarFill.style.width = pct + "%";
      if (compressionLabel) compressionLabel.textContent = `Optimizing photo ${i + 1} of ${validFiles.length}...`;

      const compressed = await compressSingleImage(f);
      stagedFiles.push(compressed);
      totalOrig += compressed.originalSize;
      totalComp += compressed.compressedSize;

      renderPreviews();
      updateDropzoneUI();
    }

    const savedPct = totalOrig > 0 ? Math.max(0, Math.round(((totalOrig - totalComp) / totalOrig) * 100)) : 0;
    if (compressionSavingsBadge) compressionSavingsBadge.textContent = `-${savedPct}% Saved`;
    if (compressionLabel) compressionLabel.textContent = "Optimization Complete · Ready for Village Network";
    if (compressionMetric) compressionMetric.textContent = `${formatBytes(totalOrig)} → ${formatBytes(totalComp)} (${savedPct}% reduction · Rapid upload ready)`;
    if (confirmUploadBtn) confirmUploadBtn.disabled = stagedFiles.length === 0;
    updateDropzoneUI();
  }

  function updateDropzoneUI() {
    if (!dropzone) return;
    if (stagedFiles.length > 0) {
      dropzone.style.display = "none";
      if (mediaStagedSection) mediaStagedSection.style.display = "flex";
      if (stagedCount) stagedCount.textContent = stagedFiles.length;
    } else {
      dropzone.style.display = "flex";
      if (mediaStagedSection) mediaStagedSection.style.display = "none";
    }
  }

  function renderPreviews() {
    if (!previewsContainer) return;
    previewsContainer.innerHTML = "";

    stagedFiles.forEach((item, index) => {
      const card = document.createElement("div");
      card.className = "media-preview-item";

      if (item.dataUrl) {
        const img = document.createElement("img");
        img.src = item.dataUrl;
        img.alt = item.name;
        card.appendChild(img);
      } else {
        const placeholder = document.createElement("div");
        placeholder.style.cssText = "display:flex;align-items:center;justify-content:center;height:100%;color:#c9a961;font-size:0.75rem;";
        placeholder.textContent = "Video / File";
        card.appendChild(placeholder);
      }

      const removeBtn = document.createElement("button");
      removeBtn.className = "media-preview-remove";
      removeBtn.type = "button";
      removeBtn.innerHTML = "&times;";
      removeBtn.setAttribute("aria-label", "Remove photo");
      removeBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        stagedFiles.splice(index, 1);
        renderPreviews();
        updateDropzoneUI();
        if (stagedFiles.length === 0) {
          if (confirmUploadBtn) confirmUploadBtn.disabled = true;
          if (compressionStatus) compressionStatus.style.display = "none";
          if (previewsContainer) previewsContainer.style.display = "none";
        }
      });
      card.appendChild(removeBtn);

      const tag = document.createElement("div");
      tag.className = "media-preview-tag";
      tag.textContent = formatBytes(item.compressedSize);
      card.appendChild(tag);

      previewsContainer.appendChild(card);
    });
  }

  /* ── Supabase Cloud Media Storage & Cross-Device Sync ───────── */
  const STORAGE_KEY = "brijesh_sangeeta_wedding_wall_memories";

  function getStoredMemories() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch (_) {
      return [];
    }
  }

  function saveMemories(list) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    } catch (err) {
      console.warn("Storage quota warning:", err);
    }
  }

  async function uploadToSupabase(item, authorName) {
    const rawExt = ((item.name && item.name.split('.').pop()) || 'webp').toLowerCase();
    const ext = ALLOWED_MEDIA_EXTS.has(rawExt) ? rawExt : 'webp';
    const cleanFileName = `photo_${Date.now()}_${Math.random().toString(36).substr(2, 6)}.${ext}`;
    const storageUrl = `${SUPABASE_CONFIG.url}/storage/v1/object/${SUPABASE_CONFIG.bucket}/${cleanFileName}`;

    let uploadBody = item.blob;
    if ((!uploadBody || uploadBody.size === 0) && item.dataUrl) {
      try {
        const parts = item.dataUrl.split(',');
        const mime = parts[0].match(/:(.*?);/)[1];
        const bstr = atob(parts[1]);
        let n = bstr.length;
        const u8arr = new Uint8Array(n);
        while (n--) {
          u8arr[n] = bstr.charCodeAt(n);
        }
        uploadBody = new Blob([u8arr], { type: mime });
      } catch (convErr) {
        console.warn("Fallback conversion error:", convErr);
      }
    }

    if (!uploadBody || uploadBody.size === 0) {
      uploadBody = item.file || item;
    }

    const contentType = (uploadBody && uploadBody.type) || "image/webp";

    const uploadRes = await fetch(storageUrl, {
      method: "POST",
      headers: {
        "apikey": SUPABASE_CONFIG.anonKey,
        "Authorization": `Bearer ${SUPABASE_CONFIG.anonKey}`,
        "Content-Type": contentType
      },
      body: uploadBody
    });

    if (!uploadRes.ok) {
      const errText = await uploadRes.text();
      throw new Error(`Upload error: ${errText}`);
    }

    const publicUrl = `${SUPABASE_CONFIG.url}/storage/v1/object/public/${SUPABASE_CONFIG.bucket}/${cleanFileName}`;

    const tableUrl = `${SUPABASE_CONFIG.url}/rest/v1/wedding_memories`;
    await fetch(tableUrl, {
      method: "POST",
      headers: {
        "apikey": SUPABASE_CONFIG.anonKey,
        "Authorization": `Bearer ${SUPABASE_CONFIG.anonKey}`,
        "Content-Type": "application/json",
        "Prefer": "return=minimal"
      },
      body: JSON.stringify({
        author: authorName,
        media_url: publicUrl,
        media_type: contentType.startsWith("video") ? "video" : "image",
        badge: "Guest Memory",
        caption: `Shared with love by ${authorName}`
      })
    });

    memoriesCache = null; // Invalidate cache so newly uploaded photo displays immediately

    return {
      id: cleanFileName,
      author: authorName,
      time: "Just now",
      dataUrl: publicUrl,
      media_url: publicUrl,
      badge: "Guest Memory",
      title: "Shared by: " + authorName
    };
  }

  let memoriesCache = null;
  let memoriesCacheExpiry = 0;
  const MEMORIES_CACHE_TTL_MS = 45000; // 45s cache to handle high concurrency

  async function fetchRemoteMemories(forceRefresh = false) {
    const now = Date.now();
    if (!forceRefresh && memoriesCache && now < memoriesCacheExpiry) {
      return memoriesCache;
    }
    try {
      const tableUrl = `${SUPABASE_CONFIG.url}/rest/v1/wedding_memories?select=*&order=created_at.desc&limit=60`;
      const res = await fetch(tableUrl, {
        headers: {
          "apikey": SUPABASE_CONFIG.anonKey,
          "Authorization": `Bearer ${SUPABASE_CONFIG.anonKey}`
        }
      });
      if (!res.ok) return getStoredMemories();
      const rows = await res.json();
      if (!rows || !rows.length) return getStoredMemories();

      const parsed = rows.map((r) => {
        let timeStr = "Wedding Week";
        if (r.created_at) {
          try {
            timeStr = new Date(r.created_at).toLocaleDateString([], {
              month: "short",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit"
            });
          } catch (_) {}
        }
        return {
          id: r.id,
          author: r.author || "Guest Family",
          time: timeStr,
          dataUrl: r.media_url,
          media_url: r.media_url,
          badge: r.badge || "Guest Memory",
          title: "Shared by: " + (r.author || "Guest"),
          caption: r.caption || `Uploaded by ${r.author || 'Guest'} at Chandauka`
        };
      });

      memoriesCache = parsed;
      memoriesCacheExpiry = Date.now() + MEMORIES_CACHE_TTL_MS;
      return parsed;
    } catch (err) {
      console.warn("Could not fetch Supabase memories:", err);
      return getStoredMemories();
    }
  }

  async function downloadMedia(url, filename = "wedding_memory.webp") {
    if (!url) return;
    try {
      const res = await fetch(url);
      const blob = await res.blob();
      const blobUrl = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = blobUrl;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setTimeout(() => URL.revokeObjectURL(blobUrl), 1000);
    } catch (_) {
      window.open(url, "_blank");
    }
  }

  if (confirmUploadBtn) {
    confirmUploadBtn.addEventListener("click", async () => {
      if (!stagedFiles.length) return;

      const authorName = (guestNameInput && guestNameInput.value.trim()) || "Guest Family";
      const originalBtnText = confirmUploadBtn.innerHTML;

      try {
        confirmUploadBtn.disabled = true;
        const uploadedItems = [];

        for (let idx = 0; idx < stagedFiles.length; idx++) {
          const item = stagedFiles[idx];
          confirmUploadBtn.innerHTML = `<span>Uploading ${idx + 1} of ${stagedFiles.length} to Cloud...</span>`;

          try {
            const uploaded = await uploadToSupabase(item, authorName);
            uploadedItems.push(uploaded);
          } catch (uploadErr) {
            console.warn("Cloud upload fallback to local:", uploadErr);
            uploadedItems.push({
              id: "local_" + Date.now() + "_" + idx,
              author: authorName,
              time: "Just now",
              dataUrl: item.dataUrl,
              media_url: item.dataUrl,
              badge: "Guest Memory",
              title: "Shared by: " + authorName
            });
          }
        }

        // Cache locally for instant offline display
        const localList = getStoredMemories();
        uploadedItems.forEach((u) => localList.unshift(u));
        if (localList.length > 30) localList.length = 30;
        saveMemories(localList);

        // Celebration petals
        if (window.burstPetals) {
          window.burstPetals(window.innerWidth / 2, window.innerHeight / 2, 45);
        }

        // Reset form & staging
        stagedFiles = [];
        if (fileInput) fileInput.value = "";
        if (guestNameInput) guestNameInput.value = "";
        if (compressionStatus) compressionStatus.style.display = "none";
        updateDropzoneUI();

        // Close upload modal, refresh and open photo wall
        closeModal(uploadModal);
        await renderPhotoWall();
        openModal(photoWallModal);
        if (slideshowView) slideshowView.style.display = "block";
        startSlideshowAt(0);

      } catch (err) {
        alert("Upload error. Please try again or use Google Drive link.");
      } finally {
        confirmUploadBtn.innerHTML = originalBtnText;
        confirmUploadBtn.disabled = false;
      }
    });
  }

  /* ── Live Wedding Photo Wall & Slideshow ──────────────────────── */
  // Pre-seeded authentic wedding moments
  const DEFAULT_MOMENTS = [
    {
      id: "seed_1",
      badge: "Tilak Ceremony",
      author: "Yadav Parivaar",
      time: "Village Chandauka",
      title: "Shubh Tilak & Sagun",
      caption: "Sacred blessings, turmeric tilak, and traditional rituals beginning the auspicious wedding week.",
      svgBg: "linear-gradient(135deg, #781c2b 0%, #420b16 100%)",
      svgIcon: `<svg width="120" height="120" viewBox="0 0 160 160" fill="none"><circle cx="80" cy="80" r="68" stroke="#d4af37" stroke-width="2.5" stroke-dasharray="2 4"/><circle cx="80" cy="80" r="62" stroke="#d4af37" stroke-width="1.2"/><text x="80" y="87" font-family="'Noto Serif Devanagari',serif" font-size="21" fill="#fceda9" font-weight="600" text-anchor="middle">शुभ तिलक</text></svg>`
    },
    {
      id: "seed_2",
      badge: "Haldi & Mehndi",
      author: "Sangeeta's Family",
      time: "Celebration Venue",
      title: "Haldi Utsav & Fragrant Mehndi",
      caption: "Golden marigold flowers, auspicious turmeric, and intricate bridal mehndi surrounded by song and laughter.",
      svgBg: "linear-gradient(135deg, #996515 0%, #54390b 100%)",
      svgIcon: `<svg width="120" height="120" viewBox="0 0 160 160" fill="none"><circle cx="80" cy="80" r="68" stroke="#fceda9" stroke-width="2.5" stroke-dasharray="2 4"/><circle cx="80" cy="80" r="62" stroke="#fceda9" stroke-width="1.2"/><text x="80" y="87" font-family="'Noto Serif Devanagari',serif" font-size="21" fill="#fceda9" font-weight="600" text-anchor="middle">हल्दी उत्सव</text></svg>`
    },
    {
      id: "seed_3",
      badge: "Sangeet & DJ Night",
      author: "Brijesh's Brothers & Friends",
      time: "Chandauka",
      title: "Dholak, Sangeet & Celebration",
      caption: "Folk wedding songs, energetic dance performances, and family camaraderie under starlight.",
      svgBg: "linear-gradient(135deg, #48131e 0%, #20040a 100%)",
      svgIcon: `<svg width="120" height="120" viewBox="0 0 160 160" fill="none"><circle cx="80" cy="80" r="68" stroke="#d4af37" stroke-width="2.5" stroke-dasharray="2 4"/><circle cx="80" cy="80" r="62" stroke="#d4af37" stroke-width="1.2"/><text x="80" y="87" font-family="'Noto Serif Devanagari',serif" font-size="20" fill="#fceda9" font-weight="600" text-anchor="middle">संगीत निशा</text></svg>`
    },
    {
      id: "seed_4",
      badge: "Shubh Vivah & Baraat",
      author: "Brijesh & Sangeeta",
      time: "31 January 2027",
      title: "The Royal Baraat & Pheras",
      caption: "The grand Baraat arrival, Jaimala garland exchange, and the sacred seven steps (Saptapadi) around the Agni.",
      svgBg: "linear-gradient(135deg, #5c1220 0%, #30060e 100%)",
      svgIcon: `<svg width="120" height="120" viewBox="0 0 160 160" fill="none"><circle cx="80" cy="80" r="68" stroke="#d4af37" stroke-width="2.5" stroke-dasharray="2 4"/><circle cx="80" cy="80" r="62" stroke="#d4af37" stroke-width="1.5"/><text x="80" y="87" font-family="'Noto Serif Devanagari',serif" font-size="22" fill="#fceda9" font-weight="600" text-anchor="middle">शुभ विवाह</text></svg>`
    }
  ];

  let allSlides = [];
  let currentSlideIndex = 0;
  let slideshowTimer = null;
  let isSlideshowPlaying = false;

  async function getAllMemories() {
    const remote = await fetchRemoteMemories();
    return [...remote, ...DEFAULT_MOMENTS];
  }

  async function deletePhoto(item, cardEl) {
    if (!item) return;
    const confirmDelete = window.confirm("Delete this photo from the live wedding wall?");
    if (!confirmDelete) return;

    try {
      // 1. Delete from Supabase Database
      if (item.id && !String(item.id).startsWith("seed_")) {
        const isUUID = /^[0-9a-fA-F-]{36}$/.test(String(item.id));
        const filter = isUUID ? `id=eq.${item.id}` : `media_url=eq.${encodeURIComponent(item.media_url || item.dataUrl)}`;
        await fetch(`${SUPABASE_CONFIG.url}/rest/v1/wedding_memories?${filter}`, {
          method: "DELETE",
          headers: {
            "apikey": SUPABASE_CONFIG.anonKey,
            "Authorization": `Bearer ${SUPABASE_CONFIG.anonKey}`
          }
        }).catch((e) => console.warn("Supabase DB delete error:", e));

        // 2. Delete from Supabase Storage bucket
        const targetUrl = item.media_url || item.dataUrl;
        if (targetUrl) {
          const pathMatch = targetUrl.match(/wedding-photos\/(.+)$/);
          if (pathMatch && pathMatch[1]) {
            await fetch(`${SUPABASE_CONFIG.url}/storage/v1/object/${SUPABASE_CONFIG.bucket}/${pathMatch[1]}`, {
              method: "DELETE",
              headers: {
                "apikey": SUPABASE_CONFIG.anonKey,
                "Authorization": `Bearer ${SUPABASE_CONFIG.anonKey}`
              }
            }).catch((e) => console.warn("Supabase storage delete error:", e));
          }
        }
      }

      // 3. Remove from localStorage cache
      memoriesCache = null;
      const stored = getStoredMemories();
      const updated = stored.filter((s) => s.id !== item.id && s.dataUrl !== item.dataUrl && s.media_url !== item.media_url);
      saveMemories(updated);

      // 4. Remove from allSlides array
      const slideIdx = allSlides.findIndex((s) => s.id === item.id || (item.dataUrl && s.dataUrl === item.dataUrl));
      if (slideIdx !== -1) {
        allSlides.splice(slideIdx, 1);
      }

      // 5. Remove card from UI with smooth fade
      if (cardEl) {
        cardEl.style.transition = "all 0.3s ease";
        cardEl.style.opacity = "0";
        cardEl.style.transform = "scale(0.85)";
        setTimeout(() => {
          if (cardEl.parentNode) cardEl.parentNode.removeChild(cardEl);
        }, 300);
      }

      // 6. Update slideshow view
      if (allSlides.length > 0) {
        if (currentSlideIndex >= allSlides.length) currentSlideIndex = 0;
        showSlide(currentSlideIndex);
      } else {
        if (slideshowView) slideshowView.style.display = "none";
      }

    } catch (err) {
      console.error("Error deleting photo:", err);
      alert("Could not delete photo. Please try again.");
    }
  }

  async function renderPhotoWall() {
    if (!wallGrid) return;
    wallGrid.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; padding: 2rem; color: #888; font-family: var(--font-body); font-size: 0.9rem;">
        Loading live memories from Cloud...
      </div>
    `;

    const items = await getAllMemories();
    allSlides = items;
    wallGrid.innerHTML = "";

    items.forEach((item, index) => {
      const card = document.createElement("div");
      card.className = "wall-card";

      const mediaWrap = document.createElement("div");
      mediaWrap.className = "wall-card__media";

      if (item.dataUrl) {
        const img = document.createElement("img");
        img.src = item.dataUrl;
        img.alt = item.author;
        img.loading = "lazy";
        img.onerror = () => {
          // Gracefully hide any broken / corrupted / dead images
          card.style.display = "none";
        };
        mediaWrap.appendChild(img);
      } else {
        mediaWrap.style.background = item.svgBg || "var(--crimson-deep)";
        mediaWrap.style.display = "flex";
        mediaWrap.style.alignItems = "center";
        mediaWrap.style.justifyContent = "center";
        mediaWrap.innerHTML = item.svgIcon || "";
      }

      const badge = document.createElement("span");
      badge.className = "wall-card__badge";
      badge.textContent = item.badge || "Wedding Moment";
      mediaWrap.appendChild(badge);

      mediaWrap.addEventListener("click", () => {
        startSlideshowAt(index);
      });

      const content = document.createElement("div");
      content.className = "wall-card__content";

      const author = document.createElement("h4");
      author.className = "wall-card__author";
      author.textContent = item.title || ("Shared by: " + item.author);

      const time = document.createElement("p");
      time.className = "wall-card__time";
      time.textContent = item.caption ? item.caption : (item.time + " · Tap to view in slideshow");

      const footer = document.createElement("div");
      footer.className = "wall-card__footer";

      const timeSpan = document.createElement("span");
      timeSpan.style.cssText = "font-size: 0.72rem; color: #888;";
      timeSpan.textContent = item.time || "";
      footer.appendChild(timeSpan);

      const actions = document.createElement("div");
      actions.className = "wall-card__actions";

      if (item.dataUrl) {
        const downloadBtn = document.createElement("button");
        downloadBtn.className = "wall-card__download-btn";
        downloadBtn.type = "button";
        downloadBtn.innerHTML = `
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
            <polyline points="7 10 12 15 17 10"></polyline>
            <line x1="12" y1="15" x2="12" y2="3"></line>
          </svg>
          <span>Download</span>
        `;
        downloadBtn.addEventListener("click", (e) => {
          e.stopPropagation();
          const cleanName = (item.author || "wedding").replace(/[^a-zA-Z0-9]/g, "_") + "_photo.webp";
          downloadMedia(item.dataUrl, cleanName);
        });
        actions.appendChild(downloadBtn);

        // Delete button for user-uploaded photos
        if (!String(item.id).startsWith("seed_")) {
          const deleteBtn = document.createElement("button");
          deleteBtn.className = "wall-card__delete-btn";
          deleteBtn.type = "button";
          deleteBtn.setAttribute("title", "Delete photo");
          deleteBtn.innerHTML = `
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <polyline points="3 6 5 6 21 6"></polyline>
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
            </svg>
            <span>Delete</span>
          `;
          deleteBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            deletePhoto(item, card);
          });
          actions.appendChild(deleteBtn);
        }
      }

      footer.appendChild(actions);

      content.appendChild(author);
      content.appendChild(time);
      content.appendChild(footer);

      card.appendChild(mediaWrap);
      card.appendChild(content);
      wallGrid.appendChild(card);
    });
  }

  function startSlideshowAt(index = 0) {
    if (!allSlides.length) return;
    currentSlideIndex = index;
    if (slideshowView) slideshowView.style.display = "block";
    showSlide(currentSlideIndex);
    playSlideshow();
    if (slideshowView) slideshowView.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }

  function showSlide(index) {
    if (!allSlides.length || !slideshowActiveSlide) return;
    if (index < 0) currentSlideIndex = allSlides.length - 1;
    else if (index >= allSlides.length) currentSlideIndex = 0;
    else currentSlideIndex = index;

    const slide = allSlides[currentSlideIndex];
    slideshowActiveSlide.innerHTML = "";

    if (slide.dataUrl) {
      const img = document.createElement("img");
      img.src = slide.dataUrl;
      img.alt = slide.author;
      img.onerror = () => {
        // Skip corrupted image to next slide
        setTimeout(() => showSlide(currentSlideIndex + 1), 600);
      };
      slideshowActiveSlide.appendChild(img);
    } else {
      const div = document.createElement("div");
      div.style.cssText = `width:100%;height:100%;background:${slide.svgBg || '#20040a'};display:flex;align-items:center;justify-content:center;`;
      div.innerHTML = slide.svgIcon || "";
      slideshowActiveSlide.appendChild(div);
    }

    const caption = document.createElement("div");
    caption.className = "slideshow-caption";
    const capTitle = document.createElement("h4");
    capTitle.textContent = slide.title || ("Shared by: " + (slide.author || "Guest"));
    const capDesc = document.createElement("p");
    capDesc.textContent = slide.caption || ((slide.badge || "Guest Memory") + " · Shared with love by " + (slide.author || "Guest"));
    caption.appendChild(capTitle);
    caption.appendChild(capDesc);
    slideshowActiveSlide.appendChild(caption);

    if (slideshowCounter) {
      slideshowCounter.textContent = `${currentSlideIndex + 1} / ${allSlides.length}`;
    }

    // Toggle slideshow delete button for active slide
    if (slideshowDeleteBtn) {
      slideshowDeleteBtn.style.display = (!String(slide.id).startsWith("seed_")) ? "inline-block" : "none";
    }
  }

  function playSlideshow() {
    isSlideshowPlaying = true;
    if (slideshowPlayToggle) slideshowPlayToggle.textContent = "Pause";
    clearInterval(slideshowTimer);
    slideshowTimer = setInterval(() => {
      showSlide(currentSlideIndex + 1);
    }, 5000);
  }

  function pauseSlideshow() {
    isSlideshowPlaying = false;
    if (slideshowPlayToggle) slideshowPlayToggle.textContent = "Resume";
    clearInterval(slideshowTimer);
  }

  function stopSlideshow() {
    pauseSlideshow();
    if (slideshowView) slideshowView.style.display = "none";
  }

  if (startSlideshowBtn) {
    startSlideshowBtn.addEventListener("click", async () => {
      if (!allSlides.length) allSlides = await getAllMemories();
      if (slideshowView) slideshowView.style.display = "block";
      const toggleBtn = $("#toggleSlideshowVisibilityBtn");
      if (toggleBtn) toggleBtn.textContent = "Hide Player";
      startSlideshowAt(0);
    });
  }

  if (closeSlideshowBtn) {
    closeSlideshowBtn.addEventListener("click", stopSlideshow);
  }

  if (slideshowPlayToggle) {
    slideshowPlayToggle.addEventListener("click", () => {
      if (isSlideshowPlaying) pauseSlideshow();
      else playSlideshow();
    });
  }

  if (toggleSlideshowVisibilityBtn) {
    toggleSlideshowVisibilityBtn.addEventListener("click", () => {
      if (!slideshowView) return;
      if (slideshowView.style.display === "none") {
        slideshowView.style.display = "block";
        toggleSlideshowVisibilityBtn.textContent = "Hide Player";
        startSlideshowAt(currentSlideIndex || 0);
      } else {
        pauseSlideshow();
        slideshowView.style.display = "none";
        toggleSlideshowVisibilityBtn.textContent = "Show Player";
      }
    });
  }

  if (slideshowDeleteBtn) {
    slideshowDeleteBtn.addEventListener("click", () => {
      if (!allSlides.length) return;
      const current = allSlides[currentSlideIndex];
      if (current) deletePhoto(current);
    });
  }

  if (slideshowPrevBtn) {
    slideshowPrevBtn.addEventListener("click", () => {
      showSlide(currentSlideIndex - 1);
      if (isSlideshowPlaying) playSlideshow();
    });
  }

  if (slideshowNextBtn) {
    slideshowNextBtn.addEventListener("click", () => {
      showSlide(currentSlideIndex + 1);
      if (isSlideshowPlaying) playSlideshow();
    });
  }

  if (slideshowFullscreenBtn) {
    slideshowFullscreenBtn.addEventListener("click", () => {
      if (!slideshowView) return;
      if (!document.fullscreenElement) {
        slideshowView.requestFullscreen().catch((err) => console.warn(err));
      } else {
        document.exitFullscreen().catch((err) => console.warn(err));
      }
    });

    document.addEventListener("fullscreenchange", () => {
      slideshowFullscreenBtn.textContent = document.fullscreenElement ? "Exit Fullscreen" : "Fullscreen";
    });
  }

  if (slideshowDownloadBtn) {
    slideshowDownloadBtn.addEventListener("click", () => {
      if (!allSlides.length || currentSlideIndex < 0 || currentSlideIndex >= allSlides.length) return;
      const current = allSlides[currentSlideIndex];
      if (current && current.dataUrl) {
        const cleanName = (current.author || "wedding").replace(/[^a-zA-Z0-9]/g, "_") + "_slide.webp";
        downloadMedia(current.dataUrl, cleanName);
      }
    });
  }
})();

/* ── Offline-First PWA Service Worker & Install Prompt ────────── */

(function initPWA() {
  // 1. Register Service Worker
  if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
      navigator.serviceWorker.register("./sw.js")
        .then((reg) => {
          console.log("[PWA] Service Worker active with scope:", reg.scope);
        })
        .catch((err) => {
          console.warn("[PWA] Service Worker registration failed:", err);
        });
    });
  }

  // 2. Offline Status Detection & Toast
  function updateOnlineStatus() {
    let toast = document.getElementById("offlineToast");
    if (!navigator.onLine) {
      if (!toast) {
        toast = document.createElement("div");
        toast.id = "offlineToast";
        toast.className = "offline-toast";
        toast.setAttribute("role", "status");
        toast.innerHTML = `
          <span class="offline-toast__dot" aria-hidden="true"></span>
          <span>Offline Mode: Wedding dates, venue map &amp; contacts saved on phone</span>
        `;
        document.body.appendChild(toast);
      }
      setTimeout(() => toast.classList.add("is-visible"), 100);
    } else if (toast) {
      toast.classList.remove("is-visible");
    }
  }

  window.addEventListener("online", updateOnlineStatus);
  window.addEventListener("offline", updateOnlineStatus);
  if (!navigator.onLine) updateOnlineStatus();

  // 3. PWA Install Prompt handling
  let deferredPrompt = null;
  const installBtn = document.getElementById("pwaInstallBtn");

  window.addEventListener("beforeinstallprompt", (e) => {
    e.preventDefault();
    deferredPrompt = e;
    if (installBtn) {
      installBtn.style.display = "inline-flex";
      installBtn.addEventListener("click", async () => {
        if (!deferredPrompt) return;
        deferredPrompt.prompt();
        const choice = await deferredPrompt.userChoice;
        if (choice && choice.outcome === "accepted") {
          installBtn.style.display = "none";
        }
        deferredPrompt = null;
      });
    }
  });

  window.addEventListener("appinstalled", () => {
    if (installBtn) installBtn.style.display = "none";
    deferredPrompt = null;
  });
})();

/* ── Live Real-Time Weather in Pratapgarh (Lat: 25.90, Lon: 81.99) ── */

(function initLiveWeather() {
  const tempEl = document.getElementById("liveWeatherTemp");
  const condEl = document.getElementById("liveWeatherCondition");
  const tagEl = document.getElementById("weatherLiveTag");
  if (!tempEl || !condEl) return;

  let cachedData = null;

  const WMO_CONDITIONS = {
    en: {
      0: "Clear Sky",
      1: "Mainly Clear",
      2: "Partly Cloudy",
      3: "Overcast",
      45: "Foggy",
      48: "Dense Rime Fog",
      51: "Light Drizzle",
      53: "Moderate Drizzle",
      55: "Dense Drizzle",
      61: "Slight Rain",
      63: "Moderate Rain",
      65: "Heavy Rain",
      80: "Passing Showers",
      81: "Moderate Showers",
      82: "Violent Showers",
      95: "Thunderstorm"
    },
    hi: {
      0: "साफ़ आसमान",
      1: "सुहावना व साफ़",
      2: "आंशिक बादल",
      3: "घने बादल",
      45: "हल्का कोहरा",
      48: "सघन कोहरा",
      51: "हल्की बूंदाबांदी",
      53: "बूंदाबांदी",
      55: "घनी बूंदाबांदी",
      61: "हल्की वर्षा",
      63: "मध्यम वर्षा",
      65: "तेज़ वर्षा",
      80: "वर्षा की बौछारें",
      81: "मध्यम बौछारें",
      82: "तेज़ बौछारें",
      95: "आंधी-तूफान"
    }
  };

  function updateDisplay(lang) {
    const activeLang = lang || (window.getCurrentLang ? window.getCurrentLang() : "en");

    if (cachedData && cachedData.current && typeof cachedData.current.temperature_2m === "number") {
      const currentTemp = Math.round(cachedData.current.temperature_2m);
      const code = cachedData.current.weather_code;
      const maxTemp = (cachedData.daily && cachedData.daily.temperature_2m_max) ? Math.round(cachedData.daily.temperature_2m_max[0]) : null;
      const minTemp = (cachedData.daily && cachedData.daily.temperature_2m_min) ? Math.round(cachedData.daily.temperature_2m_min[0]) : null;

      const codeMap = WMO_CONDITIONS[activeLang] || WMO_CONDITIONS.en;
      const desc = codeMap[code] || (activeLang === "hi" ? "सुहावना मौसम" : "Pleasant Weather");

      tempEl.textContent = `${currentTemp}°C`;

      if (maxTemp !== null && minTemp !== null) {
        if (activeLang === "hi") {
          condEl.innerHTML = `${desc} &middot; अधिकतम: ${maxTemp}°C / न्यूनतम: ${minTemp}°C`;
        } else {
          condEl.innerHTML = `${desc} &middot; High: ${maxTemp}°C / Low: ${minTemp}°C`;
        }
      } else {
        condEl.textContent = desc;
      }

      if (tagEl) {
        tagEl.textContent = activeLang === "hi" ? "लाइव" : "Live";
      }
    } else {
      // Climatological late-January baseline fallback
      tempEl.textContent = "21°C / 8°C";
      if (activeLang === "hi") {
        condEl.innerHTML = "सुहावनी खिली धूप &middot; शीतल रात्रियां";
        if (tagEl) tagEl.textContent = "पूर्वानुमान";
      } else {
        condEl.innerHTML = "Pleasant sunny days &middot; Brisk starry nights";
        if (tagEl) tagEl.textContent = "Forecast";
      }
    }
  }

  function fetchWeather() {
    const url = "https://api.open-meteo.com/v1/forecast?latitude=25.90&longitude=81.99&current=temperature_2m,weather_code&daily=temperature_2m_max,temperature_2m_min&timezone=Asia%2FKolkata";
    fetch(url)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data) => {
        if (data && data.current) {
          cachedData = data;
          updateDisplay();
        }
      })
      .catch((err) => {
        console.warn("Live weather service fallback:", err);
        updateDisplay();
      });
  }

  window.addEventListener("weddingLangChange", (e) => {
    updateDisplay(e.detail && e.detail.lang);
  });

  fetchWeather();
})();

/* ── Family & Well-Wishers Bilingual Names Sync ─────────────── */

(function initFamilyNames() {
  const FAMILY_NAMES = {
    en: {
      elders: ["J.P. Bhaiya", "Abhishek", "Ajeet", "Vineet", "Satya Prakash", "Amit"],
      friends: ["Yogesh", "Dharmendra"],
      kids: ["Anmol", "Abhimanyu", "Krishna", "Avyansh", "Anaika", "Aisha", "Shanvi", "Sudha", "Aditi"]
    },
    hi: {
      elders: ["जे.पी. भैया", "अभिषेक", "अजीत", "विनीत", "सत्य प्रकाश", "अमित"],
      friends: ["योगेश", "धर्मेन्द्र"],
      kids: ["अनमोल", "अभिमन्यु", "कृष्णा", "अव्यांश", "अनायका", "आयशा", "शान्वी", "सुधा", "अदिति"]
    }
  };

  function updateFamily(lang) {
    const activeLang = lang || (window.getCurrentLang ? window.getCurrentLang() : "en");
    const data = FAMILY_NAMES[activeLang] || FAMILY_NAMES.en;

    const render = (arr) => arr.map((n) => `<span>${n}</span>`).join(" <i>&middot;</i> ");

    const eldersEl = document.getElementById("familyEldersNames");
    const friendsEl = document.getElementById("familyFriendsNames");
    const kidsEl = document.getElementById("familyKidsNames");

    if (eldersEl) eldersEl.innerHTML = render(data.elders);
    if (friendsEl) friendsEl.innerHTML = render(data.friends);
    if (kidsEl) kidsEl.innerHTML = render(data.kids);
  }

  window.addEventListener("weddingLangChange", (e) => {
    updateFamily(e.detail && e.detail.lang);
  });

  const initialLang = window.getCurrentLang ? window.getCurrentLang() : "en";
  if (initialLang === "hi") {
    updateFamily("hi");
  }
})();
