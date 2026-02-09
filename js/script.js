// Toggle class active

const navbarNav = document.querySelector(".navbar-nav");
const hamburgerBtn = document.querySelector("#hamburger-menu");

if (navbarNav && hamburgerBtn) {
  hamburgerBtn.onclick = () => {
    navbarNav.classList.toggle("active");
  };

  document.addEventListener("click", (e) => {
    if (!hamburgerBtn.contains(e.target) && !navbarNav.contains(e.target)) {
      navbarNav.classList.remove("active");
    }
  });
}


// MAP & FOOTER

document.querySelectorAll('.map-overlay, .footer-social a').forEach(el => {
  el.addEventListener('touchend', (e) => {
    e.preventDefault();       // cegah click default
    e.stopPropagation();      // cegah trigger ganda
    window.open(el.href, '_blank');
  });
});

// About Slide Gallery

const track = document.querySelector(".about-slider .slider-track");
const slides = document.querySelectorAll(".about-slider .slide");

if (!track || slides.length === 0) {
  console.warn("Slider tidak ditemukan — dilewati");
} else {
  let index = 0;
  let startX = 0;
  let startY = 0;
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

    if (index > maxIndex) index = maxIndex;
    if (index < 0) index = 0;

    track.style.transform = `translateX(-${index * slideWidth}px)`;
  }

  function nextSlide() {
    if (index < slides.length - visibleSlides()) {
      index++;
    } else {
      index = 0;
    }
    moveSlide();
  }

  function prevSlide() {
    if (index > 0) index--;
    moveSlide();
  }

  // ===== AUTO SLIDE =====
  let autoSlide = setInterval(nextSlide, 3000);

  function resetAuto() {
    clearInterval(autoSlide);
    autoSlide = setInterval(nextSlide, 3000);
  }

  // ===== RESIZE (DEBOUNCE) =====
  let resizeTimer;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);

    resizeTimer = setTimeout(() => {
      index = 0;
      moveSlide();
    }, 150);
  });

  // =========================
  // POINTER EVENTS (menggantikan touch + mouse)
  // =========================

  track.addEventListener("pointerdown", (e) => {
    isDragging = true;
    clearInterval(autoSlide);
    startX = e.clientX;
    startY = e.clientY;
  });

  track.addEventListener("pointerup", (e) => {
    if (!isDragging) return;
    isDragging = false;
    handleSwipe(e.clientX, e.clientY);
    resetAuto();
  });

  track.addEventListener("pointerleave", () => {
    if (isDragging) {
      isDragging = false;
      resetAuto();
    }
  });

  // =========================
  // SWIPE LOGIC
  // =========================

  function handleSwipe(endX, endY) {
    // abaikan swipe vertikal
    if (Math.abs(endY - startY) > Math.abs(endX - startX)) return;

    if (startX - endX > SWIPE_THRESHOLD) {
      nextSlide();
    } else if (endX - startX > SWIPE_THRESHOLD) {
      prevSlide();
    }
  }

  // init posisi awal
  moveSlide();
}
