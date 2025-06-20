const container = document.querySelector('.VideoContainer');
const indexVideo = container.querySelector('.indexVideo');
const scene1Video = container.querySelector('.scene1Video');
const playBtn = container.querySelector('.playBtn');

indexVideo.playbackRate = 0.9;

playBtn.addEventListener('click',(event)=>{
    indexVideo.style.display = 'none';
        scene1Video.style.display = 'block';
        event.target.style.display = 'none';
        scene1Video.play();
})


scene1Video.addEventListener('ended', () => {
    setTimeout(() => {
        window.location.href = 'about.html';
    }, 500);
});