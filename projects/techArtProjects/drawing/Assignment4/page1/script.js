function angle(cx,cy,ex,ey){
     dy = ey - cy; 
     dx = ex - cx;
     rad = Math.atan2(dy,dx);
     deg = rad * 180 / Math.PI;
    return deg;
}

var anchor;
var rekt;
var anchorX;
var anchorY; 
document.addEventListener('mousemove', (event) =>{
    const mouseX = event.clientX;
    const mouseY = event.clientY;

    anchor = document.getElementById('eye11');
    rekt = anchor.getBoundingClientRect();
    anchorX = rekt.left + rekt.width / 2;
    anchorY = rekt.top + rekt.height / 2;
    angleDeg = angle(mouseX,mouseY,anchorX,anchorY);
    eye = document.querySelector('.eye11circle');
    eye.style.transform = `translate(120px, 55px) rotate(${180 +  angleDeg}deg)`;

    anchor = document.getElementById('eye12');
    rekt = anchor.getBoundingClientRect();
    anchorX = rekt.left + rekt.width / 2;
    anchorY = rekt.top + rekt.height / 2;
    angleDeg = angle(mouseX,mouseY,anchorX,anchorY);
    eye = document.querySelector('.eye12circle');
    eye.style.transform = `translate(103px, 48px) rotate(${90 + angleDeg}deg)`;

    anchor = document.getElementById('eye13');
    rekt = anchor.getBoundingClientRect();
    anchorX = rekt.left + rekt.width / 2;
    anchorY = rekt.top + rekt.height / 2;
    angleDeg = angle(mouseX,mouseY,anchorX,anchorY);
    eye = document.querySelector('.eye13circle');
    eye.style.transform = `translate(90px, 65px) rotate(${90 +  angleDeg}deg)`;

    anchor = document.getElementById('eye14');
    rekt = anchor.getBoundingClientRect();
    anchorX = rekt.left + rekt.width / 2;
    anchorY = rekt.top + rekt.height / 2;
    angleDeg = angle(mouseX,mouseY,anchorX,anchorY);
    eye = document.querySelector('.eye14circle');
    eye.style.transform = ` translate(35px, 67px) rotate(${90 +  angleDeg}deg)`;

    anchor = document.getElementById('eye21');
    rekt = anchor.getBoundingClientRect();
    anchorX = rekt.left + rekt.width / 2;
    anchorY = rekt.top + rekt.height / 2;
    angleDeg = angle(mouseX,mouseY,anchorX,anchorY);
    eye = document.querySelector('.eye21circle');
    eye.style.transform = `translate(59px, 92px) rotate(${90 +  angleDeg}deg)`;

    anchor = document.getElementById('eye24');
    rekt = anchor.getBoundingClientRect();
    anchorX = rekt.left + rekt.width / 2;
    anchorY = rekt.top + rekt.height / 2;
    angleDeg = angle(mouseX,mouseY,anchorX,anchorY);
    eye = document.querySelector('.eye24circle');
    eye.style.transform = `translate(24px, 80px) rotate(${90 +  angleDeg}deg)`;

    anchor = document.getElementById('eye31');
    rekt = anchor.getBoundingClientRect();
    anchorX = rekt.left + rekt.width / 2;
    anchorY = rekt.top + rekt.height / 2;
    angleDeg = angle(mouseX,mouseY,anchorX,anchorY);
    eye = document.querySelector('.eye31circle');
    eye.style.transform = `translate(72px, 65px) rotate(${90 +  angleDeg}deg)`;

    anchor = document.getElementById('eye34');
    rekt = anchor.getBoundingClientRect();
    anchorX = rekt.left + rekt.width / 2;
    anchorY = rekt.top + rekt.height / 2;
    angleDeg = angle(mouseX,mouseY,anchorX,anchorY);
    eye = document.querySelector('.eye34circle');
    eye.style.transform = `translate(11px, 78px) rotate(${90 +  angleDeg}deg)`;

    anchor = document.getElementById('eye41');
    rekt = anchor.getBoundingClientRect();
    anchorX = rekt.left + rekt.width / 2;
    anchorY = rekt.top + rekt.height / 2;
    angleDeg = angle(mouseX,mouseY,anchorX,anchorY);
    eye = document.querySelector('.eye41circle');
    eye.style.transform = `translate(56px, 66px) rotate(${90 +  angleDeg}deg)`;

    anchor = document.getElementById('eye44');
    rekt = anchor.getBoundingClientRect();
    anchorX = rekt.left + rekt.width / 2;
    anchorY = rekt.top + rekt.height / 2;
    angleDeg = angle(mouseX,mouseY,anchorX,anchorY);
    eye = document.querySelector('.eye44circle');
    eye.style.transform = `translate(35px, 60px) rotate(${90 +  angleDeg}deg)`;



    anchor = document.getElementById('eye51');
    rekt = anchor.getBoundingClientRect();
    anchorX = rekt.left + rekt.width / 2;
    anchorY = rekt.top + rekt.height / 2;
    angleDeg = angle(mouseX,mouseY,anchorX,anchorY);
    eye = document.querySelector('.eye51circle');
    eye.style.transform = `translate(108px, 32px) rotate(${270 +  angleDeg}deg)`;

    anchor = document.getElementById('eye52');
    rekt = anchor.getBoundingClientRect();
    anchorX = rekt.left + rekt.width / 2;
    anchorY = rekt.top + rekt.height / 2;
    angleDeg = angle(mouseX,mouseY,anchorX,anchorY);
    eye = document.querySelector('.eye52circle');
    eye.style.transform = `translate(85px, 17px) rotate(${270 +  angleDeg}deg)`;

    anchor = document.getElementById('eye53');
    rekt = anchor.getBoundingClientRect();
    anchorX = rekt.left + rekt.width / 2;
    anchorY = rekt.top + rekt.height / 2;
    angleDeg = angle(mouseX,mouseY,anchorX,anchorY);
    eye = document.querySelector('.eye53circle');
    eye.style.transform = `translate(87px, 30px) rotate(${270 +  angleDeg}deg)`;

    anchor = document.getElementById('eye54');
    rekt = anchor.getBoundingClientRect();
    anchorX = rekt.left + rekt.width / 2;
    anchorY = rekt.top + rekt.height / 2;
    angleDeg = angle(mouseX,mouseY,anchorX,anchorY);
    eye = document.querySelector('.eye54circle');
    eye.style.transform = `translate(35px, 46px) rotate(${90 +  angleDeg}deg)`;
})

const btn = document.querySelector("#nextPage");
const page = document.querySelector('#container');


btn.addEventListener('mouseover', () =>{
    page.classList.add('shake');
   
    document.body.style.background = 'rgb(180, 0, 0)';
    
})

btn.addEventListener('mouseout', () =>{
    page.classList.remove('shake');
   
    document.body.style.background = 'white';
    
})

const background = document.querySelector('body');
displayHeight = () => background.style.height = window.innterHeight + 'px';