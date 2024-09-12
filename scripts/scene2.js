const container = document.querySelector('#container');
const video = container.querySelector('.scene2Video');
const playBtn = container.querySelector('.playBtn');

playBtn.addEventListener('click',(event)=>{
    if(video.paused){
        video.play();
        console.log(event.target);
        event.target.style.display = 'none';
    }
    else{
        video.pause();
        console.log(event.target);
        event.target.style.display = 'none';
    }
})

const projects = {
    'Emotion-Based Music Recommender System Using Image Classification':'../projects/emotionDetection/templates/index.html',
    'Computer Vision Golf Ball Tracking and Detection Model': 'javascript:openVideo()',
    'Generative Art Gallery': '../projects/drawing',
    'Web Development Projects': '../projects/webdev',
    'Full Stack E-Commerce Site with Shopify':'https://aronicadiffuser.myshopify.com/',
    
};


function openVideo() {
    window.open('projects/golfball.avi', '_blank', 'width=800,height=600');
}

document.addEventListener('DOMContentLoaded', () => {
    const starWrapper = document.querySelector('.starWrapper');
    const video = document.querySelector('video');
    const wrapperWidth = video.offsetWidth;
    const wrapperHeight = video.offsetHeight;
    const projectTitles = Object.keys(projects);
    const numberOfStars = projectTitles.length; 
    const starSize = 160; // Width and height of the star element including border

    // Set the dimensions of the starWrapper to match the video
    starWrapper.style.width = `${wrapperWidth}px`;
    starWrapper.style.height = `${wrapperHeight}px`;

    // Array to store positions of placed stars
    const starPositions = [];
    let clickedStars = 0; // Counter for clicked stars

    projectTitles.forEach((title, i) => {
        const star = document.createElement('div');
        star.classList.add('star');

        const a = document.createElement('a');
        a.href = projects[title];
        
        const img = document.createElement('img');
        img.classList.add('starImg');
        img.src = 'media/star.png';
        img.id = `project${i+1}`;

        const text = document.createElement('p');
        text.classList.add('text');
        text.textContent = title;

        a.appendChild(img);
        a.appendChild(text);

        star.appendChild(a);

        let x, y, overlapping;
        do {
            overlapping = false;
            x = Math.random() * (wrapperWidth - starSize);
            y = Math.random() * (wrapperHeight - starSize);

            for (let pos of starPositions) {
                let distance = Math.sqrt((x - pos.x) ** 2 + (y - pos.y) ** 2);
                if (distance < starSize) {
                    overlapping = true;
                    break;
                }
            }
        } while (overlapping);

        starPositions.push({ x, y });

        star.style.top = `${y}px`;
        star.style.left = `${x}px`;
        starWrapper.appendChild(star);
    });

    const stars = document.querySelectorAll('.star');
    stars.forEach(star => {
        star.addEventListener('click', (event) => {
            const textElement = star.querySelector('.text');
            if (textElement) {
                textElement.style.color = 'green';
            }

            const imgElement = star.querySelector('.starImg');
            if (imgElement) {
                imgElement.style.border = '5px solid green';
            }

            if (!star.classList.contains('clicked')) {
                star.classList.add('clicked');
                clickedStars++;
                
                if (clickedStars === numberOfStars) {
                    window.location.href = 'experience.html';
                }
            }
        });
    });
});
