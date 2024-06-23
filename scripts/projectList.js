function openVideo() {
    window.open('projects/golfball.avi', '_blank', 'width=800,height=600');
}


const projects = {
    'Computer Vision Golf Ball Tracking and Detection Model': {
        url: 'javascript:openVideo()',
        description: "Video result demonstrating ML model's capabilities adept at handling varying trajectories and lighting conditions for golf ball detection and tracking."
    },
    'Generative Art Gallery': {
        url: 'https://i6.cims.nyu.edu/~aoh2024/drawing/index.html',
        description: 'Visually compelling generative art that experiments with mathematical calculations, randomness, and user interactivity. Each project incorporates Web APIS, raster/vector graphics, CSS animation, JS libraries, HTML canvas,etc. '
    },
    'Web Development Projects': {
        url: 'https://i6.cims.nyu.edu/~aoh2024/webdev/index.html',
        description: 'Full stack projects with front-end languages including HTML, CSS, JS as well as back-end languages including SQL and PHP.'
    }
};



window.onload = () => {
    const projectList = document.getElementById('projectList');
    
    Object.keys(projects).forEach((title) => {
        const project = projects[title];

        const listItem = document.createElement('li');
        const link = document.createElement('a');
        link.href = project.url;
        link.textContent = title;
        listItem.appendChild(link);

        const description = document.createElement('ul');
        const descriptionItem = document.createElement('li');
        descriptionItem.textContent = `Description: ${project.description}`;
        description.appendChild(descriptionItem);
        listItem.appendChild(description);

        projectList.appendChild(listItem);
    });
};
