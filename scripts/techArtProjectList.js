const projects = {
    'In The Mind Palace (Animation)': {
        url: 'https://www.youtube.com/watch?v=kPwkQ5NfvDQ',
        skills: 'Animation, Procreate, Premiere Pro',
        description: 'Step into my mind palace?'
    },
    '2D City (AR)':{
        url: 'https://youtube.com/shorts/Pgdrf1bA41g',
        skills: 'Augemented Reality, Adobe Aero, Animation, Procreate',
        description: "Welcome to *$5&'s 2D city! (if have adobe aero use link: https://adobeaero.app.link/z8ptZ6CVHQb)"
    },
    '3D Stained glass Angel (three JS)':{
        url: '../projects/techArtProjects/stainedGlassAngel/angel/index.html',
        skills: 'Three.js, JavaScript, HTML',
        description: "Inspired by stained glass and general beauty of Paris! <3"
    },
    'NYC vlog (animation/video editing)':{
        url: 'https://youtu.be/t5aj6N2bWd4',
        skills: 'Animation, Procreate, Premiere Pro',
        description: "Vlog abt my life in NYC! Part 1: Sept"
    },
    'Generative Art Gallery': {
        url: '../projects/techArtProjects/drawing',
        skills: 'Interacitivity, JS Game, HTML Canvas, Web APIs, CSS Animation, HTML/CSS Drawing, SVG,HTML, CSS, JS',
        description: 'Visually compelling generative art that experiments with mathematical calculations, randomness, and user interactivity. Each project incorporates Web APIS, raster/vector graphics, CSS animation, JS libraries, HTML canvas,etc. '
    },
    'Web Development Projects': {
        url: '../projects/techArtProjects/webdev',
        skills: 'Full Stack, SQL, PHP,HTML, CSS, JS',
        description: 'Full stack projects with front-end languages including HTML, CSS, JS as well as back-end languages including SQL and PHP.'
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