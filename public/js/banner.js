  const menuIcon = document.getElementById('menu-icon');
  const navLinks = document.getElementById('nav-links');

  menuIcon.addEventListener('click', (e) => {
    e.stopPropagation(); // prevent the click from bubbling to the document
    navLinks.classList.toggle('show');
  });

  // Prevent clicks inside the menu from closing it
  navLinks.addEventListener('click', (e) => {
    e.stopPropagation();
  });

  // Click anywhere else closes the menu
  document.addEventListener('click', () => {
    navLinks.classList.remove('show');
  });
