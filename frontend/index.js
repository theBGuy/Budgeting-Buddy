const form = document.getElementById('new-envelope-form');

form.addEventListener('submit', (event) => {
  event.preventDefault();

  form.reset();
});