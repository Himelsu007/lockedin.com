document.addEventListener('DOMContentLoaded', () => {
    const header = document.getElementById('main-header');
    const menuOpen = document.getElementById('menu-open');
    const menuClose = document.getElementById('menu-close');
    const sideMenu = document.getElementById('side-menu');

    // 1. Smooth Scroll Header Logic
    window.addEventListener('scroll', () => {
        // Threshold of 20px feels more responsive than 50px
        header.classList.toggle('scrolled', window.scrollY > 20);
    });

    // 2. Menu Toggle Logic
    const toggleMenu = () => sideMenu.classList.toggle('open');

    menuOpen.addEventListener('click', toggleMenu);
    menuClose.addEventListener('click', toggleMenu);

    // Close menu if a link is clicked
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => sideMenu.classList.remove('open'));
    });
});