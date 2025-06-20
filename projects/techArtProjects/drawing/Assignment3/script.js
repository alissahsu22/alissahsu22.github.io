const lock = document.querySelector(".lock");
const cube = document.querySelector('.cube');
const cube_top = document.querySelector("#top");
const item = document.querySelector('#item');
const gem = document.querySelector('.gem');

lock.onclick = function(){
    cube.classList.remove('cube:active');
    cube.classList.remove('cube:hover');
    cube.classList.add('cube_move1');
    cube_top.classList.add('top_move2');
    item.classList.add('item_move3');
    lock.style.opacity = '0';
    gem.classList.add('gem_move4');
    // void cube.offsetWidth;
    // item.classList.remove('item_move3');
};