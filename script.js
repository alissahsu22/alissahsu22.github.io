const container = document.querySelector('#container');
const indexVideo = container.querySelector('.indexVideo');
const video = container.querySelector('.scene1Video');
const playBtn = container.querySelector('.playBtn');

indexVideo.playbackRate = 0.9;

playBtn.addEventListener('click',(event)=>{
    indexVideo.style.display = 'none';
        scene1Video.style.display = 'block';
        event.target.style.display = 'none';
        scene1Video.play();
})


video.addEventListener('ended', () => {
    window.location.href = 'projects.html';
});