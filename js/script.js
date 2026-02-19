// Toggle class active
const navbarNav = document.querySelector(".navbar-nav");
const hamburgerBtn = document.querySelector("#hamburger-menu");

if (navbarNav && hamburgerBtn) {
  hamburgerBtn.onclick = () => navbarNav.classList.toggle("active");

  document.addEventListener("click", (e) => {
    if (!hamburgerBtn.contains(e.target) && !navbarNav.contains(e.target)) {
      navbarNav.classList.remove("active");
    }
  });
}

// MAP & FOOTER
document.querySelectorAll(".map-overlay, .footer-social a").forEach((el) => {
  el.addEventListener("touchend", (e) => {
    e.preventDefault();
    e.stopPropagation();
    window.open(el.href, "_blank");
  });
});

// =======================
// SLIDER ABOUT
// =======================

const track = document.querySelector(".about-slider .slider-track");
const slides = document.querySelectorAll(".about-slider .slide");

if (track && slides.length > 0) {
  let index = 0;
  let startX = 0;
  let isDragging = false;
  const SWIPE_THRESHOLD = 60;

  function visibleSlides() {
    if (window.innerWidth <= 450) return 1;
    if (window.innerWidth <= 768) return 2;
    return 3;
  }

  function moveSlide() {
    const slideWidth = track.offsetWidth / visibleSlides();
    const maxIndex = Math.max(0, slides.length - visibleSlides());

    index = Math.min(Math.max(index, 0), maxIndex);
    track.style.transform = `translateX(-${index * slideWidth}px)`;
  }

  function nextSlide() {
    index = index < slides.length - visibleSlides() ? index + 1 : 0;
    moveSlide();
  }

  let autoSlide = setInterval(nextSlide, 3000);

  function resetAuto() {
    clearInterval(autoSlide);
    autoSlide = setInterval(nextSlide, 3000);
  }

  // swipe
  track.addEventListener("pointerdown", (e) => {
    isDragging = true;
    startX = e.clientX;
    clearInterval(autoSlide);
  });

  track.addEventListener("pointerup", (e) => {
    if (!isDragging) return;
    isDragging = false;

    const endX = e.clientX;
    if (startX - endX > SWIPE_THRESHOLD) nextSlide();
    if (endX - startX > SWIPE_THRESHOLD) (index--, moveSlide());

    resetAuto();
  });

  moveSlide();
}

// ===========================
// CONTACT FORM
// ===========================

const form = document.getElementById("contact-form");
const responseMessage = document.getElementById("form-response");

if (form) {
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const payload = {
      name: document.getElementById("name").value,
      email: document.getElementById("email").value,
      phone: document.getElementById("phone").value,
      message: document.getElementById("message").value,
    };

    try {
      const res = await fetch("http://localhost:3000/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok) {
        responseMessage.textContent = "Pesan berhasil dikirim!";
        responseMessage.style.color = "lightgreen";
        form.reset();
      } else {
        responseMessage.textContent = "Gagal mengirim pesan.";
        responseMessage.style.color = "red";
      }
    } catch (error) {
      responseMessage.textContent = "Terjadi kesalahan koneksi.";
      responseMessage.style.color = "red";
    }
  });
}

// ===========================
// BOOKING FORM + POPUP
// ===========================

const bkForm = document.getElementById("booking-form");
const successModal = document.getElementById("success-modal");
const closeSuccess = document.getElementById("close-success");

if (bkForm) {
  bkForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const payload = {
      name: document.getElementById("bk-name").value,
      phone: document.getElementById("bk-phone").value,
      email: document.getElementById("bk-email").value,
      date: document.getElementById("bk-date").value,
      time: document.getElementById("bk-time").value,
      guests: document.getElementById("bk-guests").value,
      notes: document.getElementById("bk-notes").value,
      menu: [...document.querySelectorAll(".menu-options input:checked")].map(
        (i) => i.value,
      ),
    };

    const res = await fetch("http://localhost:3000/api/booking", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      // tampilkan popup
      successModal.style.display = "flex";

      // reset form
      bkForm.reset();
    } else {
      alert("Gagal mengirim reservasi.");
    }
  });
}

// tombol tutup
if (closeSuccess) {
  closeSuccess.addEventListener("click", () => {
    successModal.style.display = "none";
  });
}
