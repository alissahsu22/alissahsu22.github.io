class Player {
  constructor() {
      this.playerElement = document.getElementById('player');
      this.startX = 0;
      this.startY = 0;
      this.newX = 0;
      this.newY = 0;
      this.position = {x: 0, y:0}

      this.mouseDownHandler = this.mouseDown.bind(this);
      this.mouseMoveHandler = this.mouseMove.bind(this);
      this.mouseUpHandler = this.mouseUp.bind(this);

      this.playerElement.addEventListener('mousedown', this.mouseDownHandler);
      this.playerElement.style.backgroundImage = 'url(images/player.jpeg)';
  }

  mouseDown(e) {
      this.startX = e.clientX;
      this.startY = e.clientY;

      this.playerElement.style.backgroundImage = 'url(images/player2.jpeg)';
      this.playerElement.style.filter = 'drop-shadow(10px 3px rgb(0, 0, 0))';

      document.addEventListener('mousemove', this.mouseMoveHandler);
      document.addEventListener('mouseup', this.mouseUpHandler);
  }

  mouseMove(e) {
    let collisionDetected = false;

    this.newX = this.startX - e.clientX;
    this.newY = this.startY - e.clientY;

    this.startX = e.clientX;
    this.startY = e.clientY;

    // Calculate the new position of the player
    const newTop = this.playerElement.offsetTop - this.newY;
    const newLeft = this.playerElement.offsetLeft - this.newX;

    this.position.x = newLeft;
    this.position.y = newTop;

    const monsters = document.querySelectorAll('.monster');

    monsters.forEach(monster => {
      const monsterRect = monster.getBoundingClientRect();

        if (this.isCollide(this.playerElement, monsterRect)) {
          console.log("collision detect");
          collisionDetected = true;
            return;
        }
  
      
    });

    if (collisionDetected) {
      return; 
    }

    this.playerElement.style.top = newTop + 'px';
    this.playerElement.style.left = newLeft + 'px';

    const bbSun = document.querySelector("#sunbaby");
    const babySunRect = bbSun.getBoundingClientRect();

    if( this.isCollide(this.playerElement, babySunRect)){
      bbSun.classList.add("exitAnimation");

      setTimeout(() => {
        const overlayCanvas = document.querySelector('canvas');
        overlayCanvas.style.display = 'block';

        window.location.href = "../level3/level3.html";
    }, 2000);
  }
}

  isCollide(a, b) {
    var aRect = a.getBoundingClientRect();
    var bRect = b;

    return !(
        ((aRect.top + aRect.height) < (bRect.top)) ||
        (aRect.top > (bRect.top + bRect.height)) ||
        ((aRect.left + aRect.width) < bRect.left) ||
        (aRect.left > (bRect.left + bRect.width))
    );
  }


  mouseUp(e) {
      this.playerElement.style.backgroundImage = 'url(images/player.jpeg)';
      this.playerElement.style.filter = 'none';
      document.removeEventListener('mousemove', this.mouseMoveHandler);
      document.removeEventListener('mouseup', this.mouseUpHandler);
  }
}

const player = new Player();


const container = document.getElementById('container');
const containerbox = container.getBoundingClientRect();

function generateRandomBottomBorderPosition() {
  const x = Math.random() * innerWidth; 

  const Yrandom = Math.random() * (300 - 180) + 180;

  const y = containerbox.bottom - Yrandom; 
  
  return { x, y };
}

const numOfMonsters = 10;

for (let i = 0; i < numOfMonsters; i++) {
    const position = generateRandomBottomBorderPosition();
    
    const monster = document.createElement('div');
    monster.classList.add('monster');

    const arm = document.createElement('div');
    arm.classList.add('arm');
    const hand = document.createElement('div');
    hand.classList.add('hand');
    
    monster.appendChild(arm)
    monster.appendChild(hand)
    
    monster.style.left = position.x + 'px';
    monster.style.top = position.y  + 'px';
    
    monster.classList.add('armAnimation');
    document.body.appendChild(monster);
}


const monster = document.querySelectorAll('.monster');

monster.forEach((arm, index) => {
    const animationName = `armMove${index}`; 

    const animationDelay = index * 0.5 + 's'; 

    const keyframes = `
        @keyframes ${animationName} {
            0% { transform: translateY(0) }
            50% { transform: translateY(-${2.5 * index}rem) } /* Adjust translation based on index */
            100% { transform: translateY(0) }
        }
    `;

    const style = document.createElement('style');
    style.innerHTML = keyframes;
    document.head.appendChild(style);

    arm.style.animationName = animationName;
    arm.style.animationDuration = '3s';
    arm.style.animationIterationCount = 'infinite';
    arm.style.animationDelay = animationDelay; 
});


