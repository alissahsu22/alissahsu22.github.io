document.addEventListener('DOMContentLoaded', () => {
    const container = document.querySelector('.container');
    const video = container.querySelector('.scene2Video');
    const playBtn = container.querySelector('.Scene2playBtn');

    const source = document.createElement('source');
    source.type = 'video/mp4';

    if (window.innerWidth <= 768) {
    source.src = 'media/scene2_web.mp4';
    } else {
    source.src = 'media/scene2.mp4';
    }

    video.appendChild(source);
    video.load();


    playBtn.addEventListener('click', (event) => {
        if (video.paused) {
            video.play();
        } else {
            video.pause();
        }
        event.target.style.display = 'none';
    });

    const projects = {
        'In The Mind Palace (Animation)': {
            url: 'https://www.youtube.com/watch?v=kPwkQ5NfvDQ',
            skills: 'Animation, Procreate, Premiere Pro',
            description: 'Step into my mind palace?...'
        },
        'A Day in my Life: in Paris <3': {
            url: '../projects/techArtProjects/DayInMyLife/index.html',
            skills: 'HTML/CSS/JS, Animation, Procreate, Premiere Pro',
            description: 'Look at what a day in my life studying abroad in Paris looks like...'
        },
        '2D City (AR)': {
            url: 'https://youtube.com/shorts/Pgdrf1bA41g',
            skills: 'Augmented Reality, Adobe Aero, Animation, Procreate',
            description: "Welcome to *$5&'s 2D city!... "
        },
        '3D Stained Glass Angel (three JS)': {
            url: '../projects/techArtProjects/stainedGlassAngel/angel/index.html',
            skills: 'Three.js, JavaScript, HTML',
            description: "Inspired by stained glass and the beauty of Paris! <3..."
        },
        "Oh That's Sad (climate change short)": {
            url: 'https://youtu.be/QoIfUp9-NX4',
            skills: 'Animation, Procreate, Premiere Pro',
            description: "Submission for NYU Climate Change film festival 2025..."
        },
        'Generative Art Gallery': {
            url: '../projects/techArtProjects/drawing',
            skills: 'Interactivity, JS Game, HTML Canvas, Web APIs, CSS Animation, HTML/CSS Drawing, SVG, HTML, CSS, JS',
            description: 'Visually compelling generative art that experiments with math, randomness, and interactivity...'
        },
        'Web Development Projects': {
            url: '../projects/techArtProjects/webdev',
            skills: 'Full Stack, SQL, PHP, HTML, CSS, JS',
            description: 'Full stack projects with front-end and back-end skills...'
        },
    };

    const starWrapper = document.querySelector('.starWrapper');
    const projectTitles = Object.keys(projects);

    const isMobile = window.innerWidth <= 899;
    const mobileStarSize = 80;
    const desktopStarSize = 160;
    const starSize = isMobile ? mobileStarSize : desktopStarSize;
    const edgePadding = 10;

    const wrapperWidth = container.clientWidth;
    const wrapperHeight = container.clientHeight;

    const maxX = wrapperWidth - starSize - edgePadding;
    const maxY = wrapperHeight - starSize - edgePadding;
    const minX = edgePadding;
    const minY = edgePadding;

    // Use fewer stars on mobile
    const projectSubset = isMobile ? projectTitles.slice(0, 4) : projectTitles;

    starWrapper.style.width = `${wrapperWidth}px`;
    starWrapper.style.height = `${wrapperHeight}px`;

    const starPositions = [];
    let clickedStars = 0;

    projectSubset.forEach((title, i) => {
        const star = document.createElement('div');
        star.classList.add('star');
    
        const a = document.createElement('a');
        a.href = projects[title].url;
        a.target = '_blank';
    
        const img = document.createElement('img');
        img.classList.add('starImg');
        img.src = 'media/star.png';
        img.id = `project${i + 1}`;
    
        const text = document.createElement('p');
        text.classList.add('text');
        text.textContent = title;
    
        a.appendChild(img);
        a.appendChild(text);
        star.appendChild(a);
    
        let x, y;
    
        if (isMobile) {
            // Just random — no overlap check, safe for mobile
            x = Math.random() * (maxX - minX) + minX;
            y = Math.random() * (maxY - minY) + minY;
        } else {
            // Desktop logic with overlap check
            let overlapping, attempts = 0;
            do {
                overlapping = false;
                x = Math.random() * (maxX - minX) + minX;
                y = Math.random() * (maxY - minY) + minY;
                attempts++;
    
                for (let pos of starPositions) {
                    const distance = Math.sqrt((x - pos.x) ** 2 + (y - pos.y) ** 2);
                    if (distance < starSize) {
                        overlapping = true;
                        break;
                    }
                }
    
                if (attempts > 100) {
                    console.warn(`Could not place star #${i + 1} after 100 tries`);
                    break;
                }
            } while (overlapping);
        }
    
        starPositions.push({ x, y });
        star.style.left = `${x}px`;
        star.style.top = `${y}px`;
    
        starWrapper.appendChild(star);
    });
    

    const stars = document.querySelectorAll('.star');
    stars.forEach(star => {
        star.addEventListener('click', () => {
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

                if (clickedStars === projectSubset.length) {
                    window.location.href = 'contact.html';
                }
            }
        });
    });
});
