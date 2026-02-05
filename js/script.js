// Toggle class active

const navbarNav = document.querySelector(".navbar-nav");

// ketika hamburger menu di klik
document.querySelector("#hamburger-menu").onclick = () => {
  navbarNav.classList.toggle("active");
};

// klik di luar sidebar untuk menghilangkan nav

const hamburger = document.querySelector("#hamburger-menu");

document.addEventListener("click", function (e) {
  if (!hamburger.contains(e.target) && !navbarNav.contains(e.target)) {
    navbarNav.classList.remove("active");
  }
});


// About Slide Gallery

const track = document.querySelector('.about-slider .slider-track');
const slides = document.querySelectorAll('.about-slider .slide');

let index = 0;
let startX = 0;
let isDragging = false;
let slideWidth = slides[0].offsetWidth;

function visibleSlides() {
  if (window.innerWidth <= 576) return 1;
  if (window.innerWidth <= 992) return 2;
  return 3;
}

function moveSlide() {
  slideWidth = slides[0].offsetWidth;
  track.style.transform = `translateX(-${index * slideWidth}px)`;
}

/* Auto Slide */
setInterval(() => {
  if (index < slides.length - visibleSlides()) {
    index++;
  } else {
    index = 0;
  }
  moveSlide();
}, 3000);

/* Resize */
window.addEventListener('resize', moveSlide);

/* Touch Swipe */
track.addEventListener('touchstart', e => {
  startX = e.touches[0].clientX;
});

track.addEventListener('touchend', e => {
  let endX = e.changedTouches[0].clientX;
  handleSwipe(startX, endX);
});

/* Mouse Drag */
track.addEventListener('mousedown', e => {
  isDragging = true;
  startX = e.clientX;
});

track.addEventListener('mouseup', e => {
  if (!isDragging) return;
  isDragging = false;
  handleSwipe(startX, e.clientX);
});

function handleSwipe(start, end) {
  if (start - end > 50 && index < slides.length - visibleSlides()) {
    index++;
  } else if (end - start > 50 && index > 0) {
    index--;
  }
  moveSlide();
}
