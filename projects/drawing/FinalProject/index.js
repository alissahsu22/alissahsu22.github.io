const btn = document.querySelector("#startBtn");


btn.addEventListener( 'mouseover', function(){
    const container = document.getElementById('container');
    let count = 20;

    for(let i = 0; i < count; i++){
        let glitchBox = document.createElement('div');
        glitchBox.className = 'box';
        container.appendChild(glitchBox)
    }
    glitchInterval = setInterval( function (){
        let glitch = document.getElementsByClassName('box');
        for(let i = 0; i < glitch.length; i++){
            glitch[i].style.left = 
            Math.floor( Math.random() * 120) + 'vw';
            glitch[i].style.top = Math.floor( Math.random() * 100) + 'vh';
            glitch[i].style.width = Math.floor( Math.random() * 100) + 'px';
            glitch[i].style.height = Math.floor( Math.random() * 100) + 'px';
            glitch[i].style.backgroundPosition = Math.floor( Math.random() * 50) + 'px';
        }
        }, 100)
})

btn.addEventListener( 'mouseout', function(){
    clearInterval(glitchInterval);
    const glitchBoxes = document.querySelectorAll('.box');
    glitchBoxes.forEach(function(glitchBox) {
        glitchBox.remove(); 
    });

})

btn.addEventListener('click', function(){
    window.location.href = "level1/level1.html";

})

const navList = document.querySelectorAll(".nav");

navList.forEach(function(nav) {
    nav.addEventListener('mouseover', function(){
        nav.classList.add('shake');
    });

    nav.addEventListener('mouseout', function(){
        nav.classList.remove('shake');
    });
});
