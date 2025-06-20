const canvas = document.querySelector('#playerCanvas');
const overlayCanvas = document.querySelector('#overlayCanvas');

const context = canvas.getContext('2d');
const overlayContext = overlayCanvas.getContext('2d');

const bottomEye = document.querySelector("#eye11");
const sideEye = document.querySelector("#eye21");

const eye11 = document.querySelector("#eye11");
const eye14 = document.querySelector("#eye14");
const eye51 = document.querySelector("#eye51");
const eye54 = document.querySelector("#eye54");

const eye11Rect = eye11.getBoundingClientRect();
const eye14Rect = eye14.getBoundingClientRect();
const eye51Rect = eye51.getBoundingClientRect();
const eye54Rect = eye54.getBoundingClientRect();

let Browserwidth;
let Browserheight;
let pxScale = window.devicePixelRatio;

const player = new Player({
    position: {x:0, y:0},
    imageSrc: "images/runRight.png",

    animations: {
        idleRight: {
          imageSrc: "images/idle.png",
          loop: true,
        },
        idleLeft: {
          imageSrc: "images/idle.png",
          loop: true,
        },
        enterDoor: {
          imageSrc: "images/enterDoor.png",
          loop: false,
          onComplete: ()=>{
            
            overlay.opacity = 1;

            setTimeout(() => {
              window.location.href = "../level2/level2.html";
              console.log("completed");
          }, 500);

          }
        },
        runRight: {
            imageSrc: "images/runRight.png",
            loop: true,
        },

        runLeft: {
            imageSrc: "images/runLeft.png",
            loop: true,
        },
    }
});

const doorX = eye54Rect.x;
const doorY = eye54Rect.y;
const Xrandom = Math.random() * (100 - 30) + 30;
const Yrandom = Math.random() * (300 - 80) + 80;

const doors = [
    new Sprite({
      position: {
        x: doorX - Xrandom,
        y: doorY - Yrandom ,
      },
      imageSrc: 'images/doorOpen.png',
      frameRate: 5,
      frameBuffer: 5,
      loop: false,
      autoplay: false,
    })
]

const verticalDistance = eye51Rect.y - eye11Rect.y - player.height + eye51.clientHeight;
const horizontalDistance = eye14Rect.x - eye11Rect.x + player.width;


function setup() {
    Browserwidth = horizontalDistance;
    Browserheight = verticalDistance;

    canvas.style.width = Browserwidth + 'px';
    canvas.style.height = Browserheight + 'px';

    overlayCanvas.style.width = window.innerWidth + 'px';
    overlayCanvas.style.height = window.innerHeight + 'px';

    canvas.width = Browserwidth * pxScale;
    canvas.height = Browserheight * pxScale;

    overlayCanvas.width = (window.innerWidth * pxScale);
    overlayCanvas.height = (window.innerHeight * pxScale);

    context.scale(pxScale, pxScale);
    overlayContext.scale(pxScale, pxScale);
}

const keys = {
    w: {
      pressed: false,
    },
    a: {
      pressed: false,
    },
    d: {
      pressed: false,
    },
    ArrowUp:{
      pressed: false,
    },
    ArrowRight:{
      pressed: false,
    },
    ArrowLeft:{
      pressed: false,
    }
  }

const overlay = {
    opacity: 0,
  }
  
function animate(){
    setup();
    window.requestAnimationFrame(animate);

    doors.forEach((door) => {
        door.draw()
      })

    player.handleInput(keys);
    player.draw();
    player.update();

    overlayContext.save();
    overlayContext.globalAlpha = overlay.opacity;
    overlayContext.fillStyle = 'black';
    overlayContext.fillRect(0, 0, window.innerWidth, window.innerHeight);
    overlayContext.restore();
}


animate();