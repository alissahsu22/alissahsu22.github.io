window.addEventListener('keydown', (event) => {
    if (player.preventInput) return
    switch (event.key) {
      case 'w':
        for (let i = 0; i < doors.length; i++) {
          const door = doors[i]
            const buffer = 33;
            const buffer2 = 60;

            if (
                player.position.x >= door.position.x - buffer2 &&
                player.position.x <= door.position.x + buffer &&
                player.position.y >= door.position.y &&
                player.position.y <= door.position.y + door.height
            ) {
                player.velocity.x = 0
                player.velocity.y = 0
                player.preventInput = true
                player.switchSprite('enterDoor')
                door.play()
                return;
            }
           
        }
        if (player.velocity.y === 0) player.velocity.y = -25
        break


        case "ArrowUp":
            for (let i = 0; i < doors.length; i++) {
                const door = doors[i]
                  const buffer = 33;
                  const buffer2 = 60;
      
                  if (
                    player.position.x >= door.position.x - buffer2 &&
                    player.position.x <= door.position.x + buffer &&
                    player.position.y >= door.position.y &&
                    player.position.y <= door.position.y + door.height
                ) {
                      player.velocity.x = 0
                      player.velocity.y = 0
                      player.preventInput = true
                      player.switchSprite('enterDoor')
                      door.play()
                      return;
                  }
                 
              }
              if (player.velocity.y === 0) player.velocity.y = -25
              break
          
        case "ArrowLeft":
          keys.a.pressed = true
          break
  
        case "ArrowRight":
          keys.d.pressed = true
          break
  
      case 'a':
        keys.a.pressed = true
        break
      case 'd':
        keys.d.pressed = true
        break
    }
  })
  
  window.addEventListener('keyup', (event) => {
    switch (event.key) {
      case 'a':
        keys.a.pressed = false
  
        break
      case 'd':
        keys.d.pressed = false
  
        break
      case "ArrowLeft":
          keys.a.pressed = false
          break
  
      case "ArrowRight":
          keys.d.pressed = false
          break
  
    }
  })
  