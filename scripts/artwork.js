const matching = {
    // index, category, header, images
    'sketches': {
        header: './projects/artworkProjects/headers/sketches.svg',
        images: [ 
            ['./projects/artworkProjects/sketches/sketch0.png',""],
            ['./projects/artworkProjects/sketches/sketch1.jpg',""],
            ['./projects/artworkProjects/sketches/sketch2.jpeg',""],
            ['./projects/artworkProjects/sketches/sketch3.jpeg',""],
            ['./projects/artworkProjects/sketches/sketch4.jpeg',""],
            ['./projects/artworkProjects/sketches/sketch5.jpeg',""],
            ['./projects/artworkProjects/sketches/sketch6.jpeg',""],
            ['./projects/artworkProjects/sketches/sketch7.jpeg',""],
            ['./projects/artworkProjects/sketches/sketch8.jpeg',""],
            ['./projects/artworkProjects/sketches/sketch9.jpeg',""],
            ['./projects/artworkProjects/sketches/sketch10.jpeg',""],
            ['./projects/artworkProjects/sketches/sketch11.jpeg',""],
            ['./projects/artworkProjects/sketches/sketch12.jpeg',""],
            ['./projects/artworkProjects/sketches/sketch13.jpeg',""],
            ['./projects/artworkProjects/sketches/sketch14.jpeg',""],
            ['./projects/artworkProjects/sketches/sketch15.jpeg',""],
        ]
    },
    'graphicDesign': {
        header: './projects/artworkProjects/headers/graphicDesign.svg',
        images: [
            ['./projects/artworkProjects/graphicDesign/clubPoster.png', "Club Poster: I created a club poster for a creative tech club I started at NYU. It is supposed to be like one those prints with the paintings and the artist and description underneath but the glitch effect is invading."],
            ['./projects/artworkProjects/graphicDesign/graphic3_1.jpg', "Original Magazine (p.1): I created an original magazine based on one of my favorite musicians. This was created in Adobe InDesign, Adobe Illustrator, and original artwork was drawn in Procreate."],
            ['./projects/artworkProjects/graphicDesign/graphic3_2.png', "Original Magazine (p.2): I wanted this page to be like the daily horoscopes you get because my magazine is galaxy themed."],
            ['./projects/artworkProjects/graphicDesign/graphic3_3.png', "Original Magazine (p.3)"],
            ['./projects/artworkProjects/graphicDesign/graphic3_4.jpeg', "Original Magazine (p.4): I wanted to create a timeline that looked like constellations."],
            ['./projects/artworkProjects/graphicDesign/graphic3_5.jpeg', "Original Magazine (p.5)"],
            ['./projects/artworkProjects/graphicDesign/graphic4.png', "Political Poster: I created a political poster based on green-tech which is something I have an interest in. The Earth is on fire and the robots/tech is trying to save the Earth. This was made in Adobe Illustrator and original art in Procreate."],
            ['./projects/artworkProjects/graphicDesign/graphic5.png', "Truck Wrap: I created a truck wrap for an organization that did work in harm reduction. As a result, I wanted something that would universally appeal to anyone as to not stigmatize any person and to me cuteness is universal. It is supposed to be a window showing what is inside. I made it see through because of the complicated legal implictions of a harm reduction operation."],
            ['./projects/artworkProjects/graphicDesign/graphic2.png', "Political Poster Recreation: I recreated my original political poster because I wanted to make it look more realistic as if it were something you would see taped to a pole."],
            ['./projects/artworkProjects/graphicDesign/graphic1.png', "Movie Poster: I created a movie poster on a really good movie I had recently watched. Because the movie is about cowboys, I want to give it an old west black/white feel. Everything was done in Adobe Illustrator."],  
        ]
    },
    'videos': {
        header: './projects/artworkProjects/headers/videos.svg',
        images: [
            ['./projects/tmp.png', "coming soon"],
        ]
    },
    'other':{
        header: './projects/artworkProjects/headers/other.svg',
        images: [
            ['./projects/tmp.png', "coming soon"],
        ]
    }
}

// match header to images in folder 
let currentIndexHeader = 'sketches';
let currentIndex = 0;

function createSlideshow() {
    const slideshow = document.querySelector('.slideshow');
    slideshow.innerHTML = ''; 
    
    for (let i = 1; i <= 3; i++) {
        const container = document.createElement('div');
        const img = document.createElement('img');
        container.className = `img${i}`;
        container.appendChild(img);

        if (i == 2) {
            const description = document.createElement('div');
            description.className = 'description';
            container.appendChild(description);
        }
    
        slideshow.appendChild(container);
    }
    
    updateSlideshow();
}

function updateSlideshow() {
    const currentImages = matching[currentIndexHeader].images;
    
    // Add bounds checking to ensure we stay within the current category
    if (currentIndex >= currentImages.length) {
        currentIndex = currentImages.length - 1;
    } else if (currentIndex < 0) {
        currentIndex = 0;
    }
    
    const img1 = document.querySelector('.img1 img');
    const img2 = document.querySelector('.img2 img');
    const img3 = document.querySelector('.img3 img');
    const desc2 = document.querySelector('.img2 .description');
    
    img1.src = currentImages[(currentIndex - 1 + currentImages.length) % currentImages.length][0];
    img2.src = currentImages[currentIndex][0];
    img3.src = currentImages[(currentIndex + 1) % currentImages.length][0];
    
    const header = document.querySelector('#header');
    header.src = matching[currentIndexHeader].header;
    
    desc2.textContent = currentImages[currentIndex][1];
}


document.addEventListener('DOMContentLoaded', () => {
    createSlideshow();
    
    document.getElementById('leftBtn').addEventListener('click', () => {
        const currentImages = matching[currentIndexHeader].images;
        currentIndex = (currentIndex - 1 + currentImages.length) % currentImages.length;
        updateSlideshow();
    });

    document.getElementById('rightBtn').addEventListener('click', () => {
        const currentImages = matching[currentIndexHeader].images;
        // Add a guard clause to prevent overflow
        if (currentIndex >= currentImages.length - 1) return;
        currentIndex = (currentIndex + 1) % currentImages.length;
        updateSlideshow();
    });

    document.getElementById('leftBtnTop').addEventListener('click', () => {
        const categories = Object.keys(matching);
        const currentCategoryIndex = categories.indexOf(currentIndexHeader);
        currentIndexHeader = categories[(currentCategoryIndex - 1 + categories.length) % categories.length];
        currentIndex = 0;
        updateSlideshow();
    });

    document.getElementById('rightBtnTop').addEventListener('click', () => {
        const categories = Object.keys(matching);
        const currentCategoryIndex = categories.indexOf(currentIndexHeader);
        currentIndexHeader = categories[(currentCategoryIndex + 1) % categories.length];
        currentIndex = 0;
        updateSlideshow();
    });
});