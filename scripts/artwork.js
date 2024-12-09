const matching = {
    // index, category, header, images
    'sketches': {
        header: 'projects/headers/sketches.svg',
        images: [ 
            ['projects/sketches/sketch1.png', "description of sketch"],
            ['projects/sketches/sketch2.png', "description of sketch"],
            ['projects/sketches/sketch3.png', "description of sketch"],
            ['projects/sketches/sketch4.png', "description of sketch"],
        ]
    },
    'graphicDesign': {
        header: 'projects/headers/graphicDesign.svg',
        images: [
            ['projects/graphicDesign/graphic1.png', "description of graphic"],  
            ['projects/graphicDesign/graphic3_1.jpg', "description of graphic"],
            ['projects/graphicDesign/graphic3_2.png', "description of graphic"],
            ['projects/graphicDesign/graphic3_3.png', "description of graphic"],
            ['projects/graphicDesign/graphic3_4.jpeg', "description of graphic"],
            ['projects/graphicDesign/graphic3_5.jpeg', "description of graphic"],
            ['projects/graphicDesign/graphic4.png', "description of graphic"],
            ['projects/graphicDesign/graphic5.png', "description of graphic"],
            ['projects/graphicDesign/graphic2.png', "description of graphic"],

        ]
    },
    'videos': {
        header: 'projects/headers/videos.svg',
        images: [
            ['projects/graphicDesign/graphicTemp1.png', "description of graphic"],  
            ['projects/graphicDesign/graphicTemp2.png', "description of graphic"],
            ['projects/graphicDesign/graphicTemp1.png', "description of graphic"],
        ]
    },
    'animations': {
        header: 'projects/headers/animations.svg',
        images: [
            ['projects/animations/animationTemp1.png', "description of animation"],
            ['projects/animations/animationTemp2.png', "description of animation"],
            ['projects/animations/animationTemp1.png', "description of animation"],
        ]
    },
    'other':{
        header: 'projects/headers/other.svg',
        images: [
            ['projects/other/otherTemp1.png', "description of other"],
            ['projects/other/otherTemp2.png', "description of other"],
            ['projects/other/otherTemp1.png', "description of other"],
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
    const img1 = document.querySelector('.img1 img');
    const img2 = document.querySelector('.img2 img');
    const img3 = document.querySelector('.img3 img');

    const desc2 = document.querySelector('.img2 .description');
    const currentImages = matching[currentIndexHeader].images;
    
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