const config = {
  apiKey: "15d2ea6d0dc1d476efbca3eba2b9bbfb",  
  langIso: "es-ES",                             
  baseUrl: "https://api.themoviedb.org/3/",     
};

// Objeto que define los tipos de lista de películas disponibles.
const movieListType = {
  nowPlaying: "now_playing",                   
  popular: "popular",                          
  topRated: "top_rated",                       
  upcoming: "upcoming",                        
};

// Función para filtrar los datos de las películas obtenidas de la API.
function filterMoviesData(movies) {
  return movies.map((movie) => {               // Transforma cada película a un nuevo formato.
    const { id, title, overview, poster_path, release_date, vote_average } = movie;  // Desestructura los datos necesarios de cada película.
    return {
      cover: poster_path,                      
      title,                                   
      description: overview,                   
      year: release_date.split("-").shift(),   
      rating: vote_average,                    
      id,                                      
    };
  });
}

document.addEventListener('DOMContentLoaded', function() {
    fetch(`${config.baseUrl}movie/${movieListType.upcoming}?api_key=${config.apiKey}&language=${config.langIso}&page=1`) 
  .then(response => response.json())
  .then(data => {
      const movies = filterMoviesData(data.results);
      const moviesContainer = document.getElementById('movies');
      const row = document.createElement('div'); // Crear un div que actuará como la fila para las columnas de las tarjetas
      row.className = 'row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-3  p-1';
; // Clases de Bootstrap para el grid

      movies.forEach(movie => {
          const movieElement = document.createElement('div');
          movieElement.className = 'col'; // Clase de columna para Bootstrap
          movieElement.innerHTML = `
            <div class="card h-100">
              <img src="https://image.tmdb.org/t/p/w500${movie.cover}" class="card-img-top" alt="${movie.title}">
              <div class="card-body">
                <h5 class="card-title">${movie.title}</h5>
                <p class="card-text">${movie.description}</p>
              </div>
              <div class="card-footer">
                <small class="text-muted">Año: ${movie.year} | Puntuación: ${movie.rating}</small>
              </div>
            </div>
          `;
          row.appendChild(movieElement); // Añadir la columna al contenedor de la fila
      });
      moviesContainer.appendChild(row); // Añadir la fila al contenedor principal
  })
  .catch(error => console.error('Error fetching data:', error));
});
