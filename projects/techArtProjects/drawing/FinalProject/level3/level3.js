function main(){
    const canvas = document.getElementById("myCanvas");
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const playerCanvas = document.querySelector('#playerCanvas');
    const overlayCanvas = document.querySelector('#overlayCanvas');
    const context = playerCanvas.getContext('2d');
    const overlayContext = overlayCanvas.getContext('2d');

    let Browserwidth;
    let Browserheight;
    let pxScale = window.devicePixelRatio;


    function setup() {
        Browserwidth = window.innerWidth;
        Browserheight = window.innerHeight;
    
        playerCanvas.style.width = Browserwidth + 'px';
        playerCanvas.style.height = Browserheight + 'px';
    
        overlayCanvas.style.width = window.innerWidth + 'px';
        overlayCanvas.style.height = window.innerHeight + 'px';
    
        playerCanvas.width = Browserwidth * pxScale;
        playerCanvas.height = Browserheight * pxScale;
    
        overlayCanvas.width = (window.innerWidth * pxScale);
        overlayCanvas.height = (window.innerHeight * pxScale);
    
        context.scale(pxScale, pxScale);
        overlayContext.scale(pxScale, pxScale);
    }

    const threshold = 10;
    const minHeight = 10; 
    let sum = 0; 
    let timer = null;
    let timeToHold = 5000;

    function LimitReached(height) {
        if (height > minHeight) {
            sum += 1;
        } else {
            sum = 0; 
        }


//          threshold reached 
        if (sum >= threshold) {
            // sum = 0;
            
            const item = document.querySelector('.item');
            const itemImg = document.getElementById('item');
            const box = document.querySelector('.cube');
            const topBox = document.getElementById('top');
            
            // why does the timing change every time? 
            console.log("Adding 'shake' class to the box. Current time: 0 seconds.");
            box.classList.add('shake');
            
            setTimeout(() => {
                console.log("Adding 'spin' class to the box. Current time: 2 seconds.");
                box.classList.add('spin');
            }, 2000);
            
            setTimeout(() => {
                console.log("Adding 'topOpen' class to the topBox. Current time: 5 seconds.");
                topBox.classList.add('topOpen');
            }, 5000);
            
            setTimeout(() => {
                console.log("Adding 'popOut' class to the item. Current time: 8 seconds.");
                item.classList.add('popOut');
            }, 8000);
            
            setTimeout(() => {
                console.log("Changing src attribute of itemImg. Current time: 9.2 seconds.");
                itemImg.src = 'images/player2.jpeg';
            }, 9200);
            
            setTimeout(() => {
                console.log("Displaying overlayCanvas. Current time: 12 seconds.");
                overlayCanvas.style.display = 'block';
                window.location.href = "./end.html";   
            }, 11000);
        }            
    }

    function startTimer() {
        timer = setTimeout(() => {
            sum = 0; 
        }, timeToHold); 
    }

    function resetTimer() {
        clearTimeout(timer); 
        startTimer(); 
    }

    function updateHeight(height) {
        // console.log("curr heigh: " + height)
        LimitReached(height);
        resetTimer();
    }


    class Bar{
        constructor(x,y,width,height, color){
            this.x = x;
            this.y = y;
            this.width = width;
            this.height = height;
            this.color = color;
        }
    
        update(micInput){
            this.height = micInput * 1000;
            updateHeight(this.height);
    
        }
    
        draw(context){
            context.fillStyle = this.color;
            context.fillRect(this.x,this.y, this.width, this.height);
    
        }
    }
    
    const microphone = new Microphone();
    let bars = []
    let barWidth = canvas.width/256
    let barHeight = canvas.height/2

    function createBars(){
        for(let i = 0; i < 256; i ++){
            // let color = `hsl( ${i *2} ,100%,50%)`;
            let color = 'red';
            bars.push( new Bar(i*barWidth,barHeight,1,20,color));
        }
    }
    createBars();

    function animate(){
        if(microphone.initialized){
            ctx.clearRect(0,0,canvas.width, canvas.height);

            const samples = microphone.getSamples();
            
            bars.forEach(function(bar,i){
                    bar.update(samples[i]);
                    bar.draw(ctx);
            })
        }

       
        
        requestAnimationFrame(animate);
    }

    setup();
    animate();

}


// const item = document.querySelector('.item');
//  const box = document.querySelector('.cube');
//  const topBox = document.getElementById('top');
// box.classList.add('shake');
// box.classList.add('spin');
// topBox.classList.add('topOpen');
// item.classList.add('popOut');
