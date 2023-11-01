console.log('1) Вёрстка +10;\n2) При загрузке приложения на странице отображаются карточки фильмов с полученными от API данными +10;\n3) Если в поле поиска ввести слово и отправить поисковый запрос, на странице отобразятся карточки фильмов, в названиях которых есть это слово, если такие данные предоставляет API +10;\n4) Поиск +30;\n5) Очень высокое качество оформления приложения и/или дополнительный не предусмотренный в задании функционал, улучшающий качество приложения +10;');

const movies = document.querySelector('.movies');
const searchInput = document.querySelector('.input-search');
const searchClose = document.querySelector('.search-close');

const apiKey = 'api_key=5682d1f1503815dac3a6529ff337048b';
const baseUrl = 'https://api.themoviedb.org/3';
const url = `${baseUrl}/movie/popular?${apiKey}`;

async function getMovies() {
    try {
        const response = await fetch(url);
        const data = await response.json();
        console.log(data);

        if (data.results) {
            showMovies(data.results);
        }

    } catch (error) {
        console.log(error);
    }
}

async function searchMovies() {
    const searchValue = searchInput.value;
    const searchUrl = `${baseUrl}/search/movie?${apiKey}&query=${searchValue}`;
    try {
        const response = await fetch(searchUrl);
        const data = await response.json();
        console.log(data);

        if (data.results) {
            movies.innerHTML = '';
            showMovies(data.results);
        }
    } catch (error) {
        console.log(error);
    }
}

searchInput.focus();

searchInput.addEventListener('input', () => {
    if (searchInput.value != '') {
        searchClose.classList.remove('none');
    } else {
        searchClose.classList.add('none');
    }
});

searchInput.addEventListener('keyup', (e) => {
    if (e.key === 'Enter') {
        searchMovies();
    }
});

searchClose.addEventListener('click', () => {
    clearSearch();
});

function showMovies(data) {
    data.forEach(movie => {
        const formateReleaseDate = movie.release_date ? formatDate(movie.release_date) : '';

        const movieItem = document.createElement('div');
        movieItem.classList.add('movie');

        const movieRating = document.createElement('div');
        movieRating.classList.add('movie-rating');
        movieRating.textContent = (movie.vote_average).toFixed(1);

        movieItem.innerHTML = `
            <div class="movie-poster">
                <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title}">
                <div class="movie-poster-hover"></div>
            </div>
            <div class="movie-name">${movie.title}</div>
            <div class="movie-date">${formateReleaseDate}</div>
            <div class="movie-overview">${movie.overview}</div>
        `;

        movies.appendChild(movieItem);
        movieItem.appendChild(movieRating);

        if(movie.vote_average >= 8) movieRating.classList.add('green');
        if(movie.vote_average >= 6.5 && movie.vote_average < 8) movieRating.classList.add('yellow');
        if(movie.vote_average < 6.5) movieRating.classList.add('red');
    });
}

function formatDate(date) {
    const months = [
        'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];

    const [year, month, day] = date.split('-');
    const monthShort = months[parseInt(month, 10) - 1];

    return `${parseInt(day, 10)} ${monthShort} ${year}`;
}

function clearSearch() {
    searchClose.classList.add('none');
    searchInput.value = '';
    movies.innerHTML = '';
    getMovies();
}

getMovies();