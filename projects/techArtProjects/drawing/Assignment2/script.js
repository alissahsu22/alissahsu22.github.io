const slides = document.querySelectorAll(".slide");
let currentSlide = 0;

function change() {
  document.querySelector('.container').style.backgroundImage = `url(images/background${currentSlide}.jpg)`;
}

function noChange() {
  document.querySelector('.container').style.backgroundImage = `url(images/default.jpg)`;

}


function showSlide(index) {
  slides.forEach((slide, i) => {
    const slideWidth = slide.clientWidth;
    slide.style.transform = `translateX(-${index * slideWidth}px)`;
  });
}

function nextSlide() {
  currentSlide = (currentSlide + 1) % slides.length;
  showSlide(currentSlide);
}

function prevSlide() {
  currentSlide = (currentSlide - 1 + slides.length) % slides.length;
  showSlide(currentSlide);
}

showSlide(currentSlide);