const days = document.getElementById("days");
const hours = document.getElementById("hours");
const minutes = document.getElementById("minutes");
const seconds = document.getElementById("seconds");

const countdown_date = new Date("Dec 25, 2024 00:00:00");

function update_countdown(){
    const currentTime = new Date();
    const diff = countdown_date - currentTime;

    const d = Math.floor(diff/1000/60/60/24);
    const h = Math.floor(diff/1000/60/60) % 24;
    const m  = Math.floor(diff/1000/60) % 60;
    const s = Math.floor(diff/1000) % 60;

    days.innerHTML = d;
    hours.innerHTML = h < 10 ? '0' + h:h;
    minutes.innerHTML =  m < 10 ? '0' + m:m;
    seconds.innerHTML = s;
}
setInterval(update_countdown, 1000);
