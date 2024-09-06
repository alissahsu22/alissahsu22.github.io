
const canvas = document.querySelector('canvas');
const context = canvas.getContext('2d');
const image = document.querySelector('img')

let width;
let height;
let pxScale = window.devicePixelRatio;

function setup() {
    width = window.innerWidth;
    height = window.innerHeight;

    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';

    canvas.width = width * pxScale;
    canvas.height = height * pxScale;

    context.scale(pxScale, pxScale);
}


function draw() {
    context.drawImage(image, 0, 0, width, height);
  
    let pixels = context.getImageData(0, 0, width * pxScale, height * pxScale);
    let pixelData = pixels.data;
  
    context.clearRect(0, 0, width, height); 
    context.putImageData(pixels, 0, 0); 
    context.save();
    
    // ALEX
    context.translate(width / 3.65, height * 0.198);
    context.beginPath();
    context.rect(0, 0, width * 0.22, height * 0.08);

    contextWidth = width*.22;
    contextHeight = height*.08;

    shapeWidth = 20;
    shapeHeight = 20;
    setRange = 500; 

    for(let i = 0; i < setRange; i++){
        let randomX = Math.floor(Math.random() * width);
        let randomY = Math.floor(Math.random() * height);

        let x = randomX * pxScale;
        let y = randomY * pxScale;

        let pixel = (x + y * canvas.width) * 4;
        
        let r = pixelData[pixel];
        let g = pixelData[pixel + 1]
        let b = pixelData[pixel + 2];
        let a = pixelData[pixel + 3]

        context.fillStyle = `rgb(${r}, ${g}, ${b})`;
        
        let xCoordRandom = Math.floor(Math.random() * (contextWidth - shapeWidth) );
        let yCoordRandom = Math.floor(Math.random() * (contextHeight - shapeHeight) );
        let path = new Path2D();
        path.rect(xCoordRandom, yCoordRandom, shapeWidth, shapeHeight);
        context.fill(path); 
    }

    context.restore();

    context.translate(width*.547,height*0.27);
    context.beginPath();
    context.rect(0, 0, width * 0.22, height * 0.135);


    for(let i = 0; i < setRange; i++){
        let randomX = Math.floor(Math.random() * width);
        let randomY = Math.floor(Math.random() * height);

        let x = randomX * pxScale;
        let y = randomY * pxScale;

        let pixel = (x + y * canvas.width) * 4;
        
        let r = pixelData[pixel];
        let g = pixelData[pixel + 1]
        let b = pixelData[pixel + 2];
        let a = pixelData[pixel + 3]

        context.fillStyle = `rgb(${r}, ${g}, ${b})`;
        
        let xCoordRandom = Math.floor(Math.random() * (contextWidth - shapeWidth) );
        let yCoordRandom = Math.floor(Math.random() * (contextHeight - shapeHeight) );
        let path = new Path2D();
        path.rect(xCoordRandom, yCoordRandom, shapeWidth, shapeHeight);
        context.fill(path); 
    }


  }

window.addEventListener('load', () => {
    setup();
    draw();
});

window.addEventListener('resize', () => {
    setup();
    draw();
});


/*
const canvas = document.querySelector('canvas');
const context = canvas.getContext('2d');

let width;
let height;

// set the number of canvas, scaled for screen resolution
let pxScale = window.devicePixelRatio;
// console.log(pxScale);

const image = document.querySelector('img');

function setup() {
  // fixed canvas size
  width = canvas.width;
  height = canvas.height;

  // set the CSS display size
  canvas.style.width = width + 'px';
  canvas.style.height = height + 'px';

  canvas.width = width * pxScale;
  canvas.height = height * pxScale;

  // normalize the coordinate system
  context.scale(pxScale, pxScale);
}

function draw() {
  context.drawImage(image, 0, 0, 450, 300);

  let pixels = context.getImageData(0, 0, width * pxScale, height * pxScale);
  let pixelData = pixels.data;

  console.log(pixelData.length); // verify that image data has been read

  context.clearRect(0, 0, width, height); // clear canvas
  context.putImageData(pixels, 0, 0); // check that the whole image was sampled by drawing it back

  // coordinates should account for pixel density
  let x = 70 * pxScale;
  let y = 167 * pxScale;

  // access pixel by coordinate
  let pixel = (x + y * canvas.width) * 4;
  
  let r = pixelData[pixel];
  let g = pixelData[pixel + 1]
  let b = pixelData[pixel + 2];
  let a = pixelData[pixel + 3]

  console.log(r, g, b, a);

  context.fillStyle = `rgb(${r}, ${g}, ${b})`;
  context.fillRect(0, 0, 100, 100); // draw color in upper left corner
}

// wait for the DOM to load, including dependent resources
window.addEventListener('load', () => {
  setup();
  draw();
});




      const canvas = document.querySelector('canvas');
      const context = canvas.getContext('2d');

      let width;
      let height;

      // set the number of canvas, scaled for screen resolution
      let pxScale = window.devicePixelRatio;
      // console.log(pxScale);

      function setup() {
        // fixed canvas size
        // width = canvas.width;
        // height = canvas.height;

        // full browser canvas
        width = window.innerWidth;
        height = window.innerHeight;

        // set the CSS display size
        canvas.style.width = width + 'px';
        canvas.style.height = height + 'px';

        canvas.width = width * pxScale;
        canvas.height = height * pxScale;

        // normalize the coordinate system
        context.scale(pxScale, pxScale);
      }

      function draw() {
        // context.fillStyle = 'green';
        // context.fillRect(0, 0, width, height);

        let pixels = context.getImageData(0, 0, canvas.width, canvas.height);
        let pixelData = pixels.data;
        // console.log(pixelData.length);

        // random pixel values
        for (let i = 0; i < pixelData.length; i += 4) {
          pixelData[i] = Math.floor(Math.random() * 255); // red
          pixelData[i + 1] = Math.floor(Math.random() * 255); // green
          pixelData[i + 2] = Math.floor(Math.random() * 255); // blue
          pixelData[i + 3] = 255; // alpha
        }

        // paint canvas with random pixels
        context.putImageData(pixels, 0, 0);
      }

      // wait for the DOM to load, including dependent resources
      window.addEventListener('load', () => {
        setup();
        draw();
      });

      window.addEventListener('resize', () => {
        setup();
        draw();
      });
    

*/