const projects = {
    'In The Mind Palace (Animation)': {
        url: 'https://www.youtube.com/watch?v=kPwkQ5NfvDQ',
        skills: 'Animation, Procreate, Premiere Pro',
        description: 'Step into my mind palace? // This is the first "full" animation I have ever done. It was really fun to do all the sound design, editing, and learn about the traditional 2D frame-by-frame animation process like storyboarding and character design. The "mind palace" is something my friends and I reference a lot, especially when one of us seems in a state. As a result, I wanted to show viewers what was in my mind palace at this time and it had to deal with the pressure to be special/make something of yourself that I feel is a universal experience. The pressure to do something special can make it feel like the way you live your life is pointless otherwise but knowing that being born is enough to validate your existence is a good takeaway msg. <3'
    },
    'A Day in my Life: in Paris <3':{
        url: '../projects/techArtProjects/DayInMyLife/index.html',
        skills: 'HTML/CSS/JS, Animation, Procreate, Premiere Pro',
        description: 'Look at what a day in my life studying abroad in Paris looks like. High stress? // I wanted to experiment with user experiences on the web, so I made an interactive web "game" to take you through the highlights of my day and how I internally perceive them/express them through drawings. This was a good way to explore my interest in user interactions via the web and see how I can bring my animations to life in an interactive/dynamic way.'
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
    'NYC Vlog (animation/video editing)':{
        url: 'https://youtu.be/t5aj6N2bWd4',
        skills: 'Animation, Procreate, Premiere Pro',
        description: "Vlog abt my life in NYC! Part 1: Sept // I have a lot of pics of my friends and I in nyc but I didn't know how to put them all tg to make an animation, so this was my way of experimenting with still images and animation. This was the first animation and video editing project I completed! "
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

// const experience = {
//     'Software Engineer Intern @ Kaizen8': {
//         description: 'At Kaizen8 as a Software Engineer Intern, I played a foundational role in launching a full-stack website to showcase the company’s newest product. I managed the project from concept to completion, aligning the site with the company’s goals and image. By integrating third-party APIs and Shopify tools, I enhanced user experience and site functionality. I also leveraged custom Shopify Liquid code to save over $500 by replacing costly app add-ons. Additionally, I integrated the site with in-house systems, streamlining exportation and reducing third-party fulfillment costs by 20%, ultimately improving operational efficiency and boosting sales performance..'
//     },
//     'Software Engineer Intern, Machine Learning @ Ideas Lab': {
//         description: 'At Ideas lab as a Software Engineer intern with a focus on Machine Learning, I developed a computer vision model using YOLOv8 from scratch, designed to accurately track real golf balls based on a dataset of over 2,000 hand-drawn annotations with an accuracy of over 85%. To enhance the model’s detection robustness, engineered a synthetic data generator using OpenCV to produce more than 1,000 diverse images, simulating various trajectories and backgrounds. I also constructed convolutional neural networks in PyTorch and Tensorflow, focusing on refining each layer’s parameters to achieve optimal accuracy and efficiency to create the most accurate model possible. This work was integral to supporting in-app golf ball trajectory analysis.'
//     },
//     'Product Management Intern @ Kaizen8': {
//         description: 'At Kaizen8 as a Product Management Intern, I contributed to the company’s growth, helping it become a top 100 Amazon seller globally. By conducting in-depth research on over 100 emerging products and broadening the company’s distribution network, the company was able to expand its product catalog to over 2,500 items. Additionally, I optimized the product preparation workflow, improving order fulfillment efficiency by 20% and streamlining export processes for faster, more efficient distribution.'
//     }
// }


window.onload = () => {
    const projectList = document.getElementById('projectList');
    console.log(projectList);
    
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