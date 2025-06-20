const profile = document.querySelector('.profile');
profile.addEventListener('click', (e) => {
    e.preventDefault();
    const mailtoLink = 'mailto:aoh2024@nyu.edu';
    try {
        window.open(mailtoLink, '_blank');
    } catch (error) {
        window.location.href = mailtoLink;
    }
});
