class Player{
    // have to make animation frames same number when creating
    constructor({position, imageSrc, animations,
        loop,
        autoplay,
        }){
        this.position = position;
        this.image = new Image()
        this.image.onload = () => {
            this.loaded = true; 
            this.width = this.image.width/this.frameRate;
            this.height = this.image.height;
        }
        this.velocity = {
            x: 0,
            y:0,
        }

        this.image.src = imageSrc;
        this.width = 100;
        this.height = 100;

        this.sides = {
            bottom: this.position.y + this.height
        }
        this.gravity = 1;
        this.loaded = false;
        this.frameRate = 11;
        this.currentFrame = 0;
        this.elapsedFrames = 0;
        this.frameBuffer = 10;
        this.animations = animations;
        this.loop = loop;
        this.autoplay = autoplay;
        this.currentAnimation;

        if(this.animations){
            for(let key in this.animations){
                const image = new Image();
                image.src = this.animations[key].imageSrc;
                this.animations[key].image = image;
            }
        }
    }

    draw(){
        const cropbox = {
            position: {
                x: this.width * this.currentFrame,
                y: 0
            }, 
            width: this.width,
            height: this.height
        }
        

        const radius = Math.min(this.width, this.height) / 2; 

        overlayContext.beginPath();
        overlayContext.globalAlpha = 0.95;
        overlayContext.arc(this.position.x, this.position.y + (player.height/2), radius*30, 0, 2 * Math.PI);
        overlayContext.fillStyle = 'black';
        overlayContext.fill();
        overlayContext.closePath();


        overlayContext.globalAlpha = 0;
        context.drawImage(
            this.image, 
            cropbox.position.x,
            cropbox.position.y,
            cropbox.width,
            cropbox.height,
            this.position.x, 
            this.position.y,
            this.width, 
            this.height
        );

        overlayContext.globalAlpha = 0.2; 
        overlayContext.clearRect(this.position.x, this.position.y, this.width+100, this.height+100);
        overlayContext.beginPath();
        overlayContext.arc(this.position.x + 120 , this.position.y + (player.height / 2), radius*1.5, 0, 2 * Math.PI);
        overlayContext.fillStyle = 'red';
        overlayContext.fill();
        overlayContext.closePath();
        


        this.updateFrames();
    }

    updateFrames(){
        this.elapsedFrames++;

        if(this.elapsedFrames % this.frameBuffer == 0){
            if(this.currentFrame < this.frameRate -1 ){
                this.currentFrame ++;
            }
            else if (this.loop) this.currentFrame = 0  
        }

        if (this.currentAnimation?.onComplete) {
            if (
              this.currentFrame === this.frameRate - 1 &&
              !this.currentAnimation.isActive
            ) {
              this.currentAnimation.onComplete()
              this.currentAnimation.isActive = true
            }
          }
    }
    
    update(){
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;
        this.sides.bottom = this.position.y + this.height;


        if(this.sides.bottom + this.velocity.y < Browserheight){
            this.velocity.y += this.gravity;
            this.position.y++;  
        }
        else{
            this.velocity.y = 0;
        }


        if (this.position.x + this.width >= Browserwidth) {
            this.position.x = Browserwidth - this.width;
            this.velocity.x = 0;
        }

        if (this.position.x < 0) {
            this.position.x = 0;
            this.velocity.x = 0;
        }

    }

    handleInput(keys) {
        if (this.preventInput) return
        this.velocity.x = 0
        if (keys.d.pressed) {
          this.switchSprite('runRight')
          this.velocity.x = 5
          this.lastDirection = 'right'
        } else if (keys.a.pressed) {
          this.switchSprite('runLeft')
          this.velocity.x = -5
          this.lastDirection = 'left'
        } else {
          if (this.lastDirection === 'left') this.switchSprite('idleLeft')
          else this.switchSprite('idleRight')
        }
      }
    
      switchSprite(name) {
        if (this.image === this.animations[name].image) return
        this.currentFrame = 0
        this.image = this.animations[name].image
        this.currentAnimation = this.animations[name]
        this.loop = this.animations[name].loop
      }
}
