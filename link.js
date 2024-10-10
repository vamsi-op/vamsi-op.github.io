// JavaScript for toggling the menu icon
function toggleMenu() {
    const menuIcon = document.querySelector('.menu-icon'); // Corrected selector
    const navContainer = document.querySelector('#nav-container')
    menuIcon.classList.toggle('change'); // Add a CSS class to change the meni icon
    navContainer.classList.toggle('show'); // Add a CSS class to show/hide the links
}
