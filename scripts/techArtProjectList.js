const projects = {
    'In The Mind Palace (Animation)': {
        url: 'https://www.youtube.com/watch?v=kPwkQ5NfvDQ',
        skills: 'Animation, Procreate, Premiere Pro',
        description: 'Step into my mind palace? // This is the first "full" animation I have ever done. It was really fun to do all the sound design, editing, and learn about the traditional 2D frame-by-frame animation process like storyboarding and character design. The "mind palace" is something my friends and I reference a lot, especially when one of us seems in a state. As a result, I wanted to show viewers what was in my mind palace at this time and it had to deal with the pressure to be special/make something of yourself that I feel is a universal experience. The pressure to do something special can make it feel like the way you live your life is pointless otherwise but knowing that being born is enough to validate your existence is a good takeaway msg. <3'
    },
        'A Day in my Life: in Paris <3 (Web Experience)':{
        url: '../projects/techArtProjects/DayInMyLife/index.html',
        skills: 'HTML/CSS/JS, Animation, Procreate, Premiere Pro',
        description: 'Look at what a day in my life studying abroad in Paris looks like. High stress? // I wanted to experiment with user experiences on the web, so I made an interactive web "game" to take you through the highlights of my day and how I internally perceive them/express them through drawings. This was a good way to explore my interest in user interactions via the web and see how I can bring my animations to life in an interactive/dynamic way.'
    },
    'Lyric Visualizer (TouchDesigner) ': {
            url: 'https://youtu.be/R65ykJ22izU',
            skills: 'TouchDesigner, Python',
            description: 'Lyric Visualizer for "not strong enough - boygenius" //Recently, the concerts I’ve been to have had really cool lyric visualizers so I wanted to make one for my favorite song. I tried to incorporate all the things touch designer does well like (1) audio reactive visuals (2) 3D geometry (3) live webcam input (4) feedback/distortion/effects. It was a really great way to learn all the fundamentals of touch designer!'
        },
    '2D City (AR)':{
        url: 'https://youtube.com/shorts/Pgdrf1bA41g',
        skills: 'Augemented Reality, Adobe Aero, Animation, Procreate',
        description: "Welcome to *$5&'s 2D city! (if have adobe aero use link: https://adobeaero.app.link/z8ptZ6CVHQb) // I wanted to experiment with AR in a 2D sense bc I don't currently have the tools to do 3D renderings on software like blender, so I thought this would be the next best thing. It was also a good ooportunity to experiment with what Adobe has to offer. It was super cool to make a 2D animation in AR and something I definitely want to do again. Seeing in AR in a 3D space definitely amplifies the experience and it is super cool!"
    },
    '3D Stained Glass Angel (three JS)':{
        url: '../projects/techArtProjects/stainedGlassAngel/angel/index.html',
        skills: 'Three.js, JavaScript, HTML',
        description: "Inspired by stained glass and general beauty of Paris! <3 // I don't have the tools to do 3D rendering, but I still wanted to learn about working in a 3D space so I decided to use front-end 3D rendering tools like three.js. Paris is so beautiful and I love stained glass, so I wanted to express how beautiful Paris is in a 3D project. I made a weeping stained glass angel. I like the wings and if I was more experienced in 3D modeling I would've like to make a better body for the angel but I really had to simplify it given the limited shapes in three.js. This required a lot more math than I thought but it was still fun to do."
    },
    "Oh That's Sad (climate change short)":{
        url: 'https://youtu.be/QoIfUp9-NX4',
        skills: 'Animation, Procreate, Premiere Pro',
        description: "Submission for NYU Climate Change film festival 2025 // Making this animation gave me a new challenge as I had to incorporate statistics and fact in a way that was still engaging. It was a good experience and I'm glad I got to create a project abt something important. I care about climate change but it does seem like a very huge issue that I didn't even know if we (the world), let alone I, could do anything to fix so I wanted that to be the premise. After creating this project, I was able to learn a lot about informational storytelling and was given more hope about the individual impact with regards to helping in the fight against climate change."
    },
    'Generative Art Gallery': {
        url: '../projects/techArtProjects/drawing',
        skills: 'Interacitivity, JS Game, HTML Canvas, Web APIs, CSS Animation, HTML/CSS Drawing, SVG,HTML, CSS, JS',
        description: 'Visually compelling generative art that experiments with mathematical calculations, randomness, and user interactivity. Each project incorporates Web APIS, raster/vector graphics, CSS animation, JS libraries, HTML canvas,etc. // This class, "drawing on the web" was the class that introduced to me to the intersection of tech and code! It was all about creative expression, user interaction, and front end tools to create whatever you wanted. These are the different tools I learned throughout that class.'
    },
    'Web Development Projects': {
        url: '../projects/techArtProjects/webdev',
        skills: 'Full Stack, SQL, PHP,HTML, CSS, JS',
        description: 'Full stack projects with front-end languages including HTML, CSS, JS as well as back-end languages including SQL and PHP. // For my web design minor, I learned applications that allow me to work in full stack development. Though I especially enjoy the front end creativity, learning the backend coding was equally fun and helpful! '
    },
};



window.onload = () => {
    const projectList = document.getElementById('projectList');
    
    Object.keys(projects).forEach((title) => {
        const project = projects[title];

        const listItem = document.createElement('li');
        
        // Create a bold element for the title only
        const boldTitle = document.createElement('strong');
        const link = document.createElement('a');
        link.href = project.url;
        link.textContent = title;
        boldTitle.appendChild(link);
        listItem.appendChild(boldTitle);

        // Add skills in red
        if (project.skills) {
            const skillsText = document.createElement('div');
            skillsText.innerHTML = `Skills: <span style="color: red">${project.skills}</span>`;
            listItem.appendChild(skillsText);
        }

        // Add description as plain text
        const descriptionText = document.createElement('div');
        descriptionText.textContent = `Description: ${project.description}`;
        listItem.appendChild(descriptionText);

        projectList.appendChild(listItem);
    });

    // Object.keys(experience).forEach((title) => {
    //     const exp = experience[title];
    //     const listItem = document.createElement('li');
        
    //     const boldTitle = document.createElement('strong');
    //     const link = document.createElement('a');
    //     link.href = exp.url;
    //     link.textContent = title;
    //     boldTitle.appendChild(link);
    //     listItem.appendChild(boldTitle);

    //     const descriptionText = document.createElement('div');
    //     descriptionText.textContent = `Description: ${exp.description}`;
    //     listItem.appendChild(descriptionText);

    //     experienceList.appendChild(listItem);
    // });
};