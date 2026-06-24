/* ── Custom Cursor ── */
const cursor = document.getElementById("cursor");
let mx = 0,
  my = 0;

document.addEventListener("mousemove", (e) => {
  mx = e.clientX;
  my = e.clientY;
  cursor.style.left = mx + "px";
  cursor.style.top = my - 10 + "px";
});

/* ── Nav scroll ── */
const nav = document.getElementById("nav");
window.addEventListener("scroll", () => {
  nav.classList.toggle("scrolled", window.scrollY > 50);
});

/* ── Hamburger / Mobile Menu ── */
const hamburger = document.getElementById("hamburger");
const mobileMenu = document.getElementById("mobileMenu");
hamburger.addEventListener("click", () => {
  mobileMenu.classList.toggle("open");
});
document.querySelectorAll(".mobile-link").forEach((link) => {
  link.addEventListener("click", () => mobileMenu.classList.remove("open"));
});

/* ── Scroll-triggered reveal ── */
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const delay = (el.dataset.i || 0) * 120;
      setTimeout(() => el.classList.add("visible"), delay);
      revealObserver.unobserve(el);
    });
  },
  { threshold: 0.12 },
);

document
  .querySelectorAll(".skill-card-new")
  .forEach((el) => revealObserver.observe(el));

/* ── Carousel ── */
const track = document.getElementById("carouselTrack");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const dotsWrap = document.getElementById("carouselDots");

const cards = Array.from(track.querySelectorAll(".project-card:not(.clone)"));
const totalCards = cards.length;
let current = 0;
let autoPlay;
let isDragging = false;
let startX = 0;
let startScroll = 0;

// Build dots
cards.forEach((_, i) => {
  const dot = document.createElement("div");
  dot.className = "carousel-dot" + (i === 0 ? " active" : "");
  dot.addEventListener("click", () => goTo(i));
  dotsWrap.appendChild(dot);
});

function getCardWidth() {
  const card = cards[0];
  return card.offsetWidth + 28.8; // 1.8rem gap ≈ 28.8px at 16px base
}

function goTo(index) {
  current = (index + totalCards) % totalCards;
  track.style.transform = `translateX(-${current * getCardWidth()}px)`;
  document.querySelectorAll(".carousel-dot").forEach((d, i) => {
    d.classList.toggle("active", i === current);
  });
}

function startAuto() {
  autoPlay = setInterval(() => goTo(current + 1), 5000);
}
function stopAuto() {
  clearInterval(autoPlay);
}

prevBtn.addEventListener("click", () => {
  stopAuto();
  goTo(current - 1);
  startAuto();
});
nextBtn.addEventListener("click", () => {
  stopAuto();
  goTo(current + 1);
  startAuto();
});

// Drag to scroll
track.addEventListener("mousedown", (e) => {
  isDragging = true;
  startX = e.pageX;
  track.style.transition = "none";
  stopAuto();
});
document.addEventListener("mouseup", (e) => {
  if (!isDragging) return;
  isDragging = false;
  track.style.transition = "";
  const diff = e.pageX - startX;
  if (diff < -50) goTo(current + 1);
  else if (diff > 50) goTo(current - 1);
  else goTo(current);
  startAuto();
});
document.addEventListener("mousemove", (e) => {
  if (!isDragging) return;
});

// Touch support
track.addEventListener(
  "touchstart",
  (e) => {
    startX = e.touches[0].pageX;
    stopAuto();
  },
  { passive: true },
);
track.addEventListener("touchend", (e) => {
  const diff = e.changedTouches[0].pageX - startX;
  if (diff < -50) goTo(current + 1);
  else if (diff > 50) goTo(current - 1);
  startAuto();
});

goTo(0);
startAuto();

/* ── Contact Form ── */
const form = document.getElementById("contactForm");
const formMsg = document.getElementById("formMsg");

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const btn = form.querySelector(".btn-send");
  btn.disabled = true;
  btn.querySelector("span:first-child") &&
    (btn.childNodes[0].textContent = "Sending...");
  formMsg.className = "form-msg";
  formMsg.textContent = "";

  const data = {
    name: form.name.value.trim(),
    email: form.email.value.trim(),
    subject: form.subject.value.trim(),
    message: form.message.value.trim(),
  };

  try {
    const res = await fetch("/.netlify/functions/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const result = await res.json();
    if (res.ok && result.success) {
      formMsg.classList.add("success");
      formMsg.textContent = "✓ Message sent! I'll be in touch within 24 hours.";
      form.reset();
    } else {
      throw new Error(result.message || "Something went wrong.");
    }
  } catch (err) {
    formMsg.classList.add("error");
    formMsg.textContent = "✗ " + err.message;
  } finally {
    btn.disabled = false;
    btn.childNodes[0].textContent = "Send Message ";
  }
});

/* ── Active nav highlight on scroll ── */
const sections = document.querySelectorAll("section[id]");
const navAnchors = document.querySelectorAll(".nav-links a");
const secObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      navAnchors.forEach((a) => {
        a.style.color =
          a.getAttribute("href") === "#" + entry.target.id ? "white" : "";
      });
    });
  },
  { threshold: 0.4 },
);
sections.forEach((s) => secObserver.observe(s));
