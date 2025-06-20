const page = document.querySelector('body');
const scene = document.querySelector('#scene')
const heart = document.querySelector('#heart');

displayHeight = () => scene.style.height = window.innerHeight + 'px';

var prevScale = 0; 

var count = 0; 

elementTransform = () => {
  let pageDimensions = page.getBoundingClientRect();
  let scrollPercentage = Math.abs(pageDimensions.top) / (pageDimensions.height - window.innerHeight);
  let scale = scrollPercentage;
  heart.style.transform = `translateX(-50%) scale(${scale+0.3})`;
  
  if(scale > prevScale){
    page.style.background = "radial-gradient(circle, rgba(247,229,229,1) 0%, rgba(195,15,15,1) 47%, rgba(115,2,2,1) 91%)";
    count += 1; 
  }
  else{
    page.style.background = "white";
  }
  prevScale = scale;


  if(count >= 50){
    heart.classList.add('beat1');
  }
}

window.addEventListener('load', displayHeight);
window.addEventListener('scroll', elementTransform);
window.addEventListener('resize', function() {
  displayHeight();
  elementTransform();
});

