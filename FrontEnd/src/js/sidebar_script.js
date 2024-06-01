document.addEventListener('DOMContentLoaded', function() {
  const sidebar = document.getElementById('sidebar');
  const toggleBtn = document.querySelector('.toggle-btn');

  // Iniciar con el sidebar cerrado
  sidebar.classList.remove('expand');

  toggleBtn.addEventListener('click', function() {
      sidebar.classList.toggle('expand');
  });
});
