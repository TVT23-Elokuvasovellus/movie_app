import './Search.css';
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

function Search() {
    const [search, setSearch] = useState('');
    const [results, setResults] = useState([]);
    const [genres, setGenres] = useState([]);
    const [selectedGenre, setSelectedGenre] = useState('');
    const [selectedSort, setSelectedSort] = useState('');
    const [selectedYear, setSelectedYear] = useState('');
    const [currentSearch, setCurrentSearch] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const token = process.env.REACT_APP_API_TOKEN;
    const navigate = useNavigate();

    const options = {
        method: 'GET',
        headers: {
            accept: 'application/json',
            Authorization: `Bearer ${token}`
        }
    };

    const updateSearch = (event) => {
        setSearch(event.target.value);
    };

    const handleGenreChange = (event) => {
        setSelectedGenre(event.target.value);
    };

    const handleSortChange = (event) => {
        setSelectedSort(event.target.value);
    };

    const handleYearChange = (event) => {
        setSelectedYear(event.target.value);
    };

    const getGenres = () => {
        const url = `https://api.themoviedb.org/3/genre/movie/list?api_key=${token}&language=en-US`;
        console.log(`Fetching genres with URL: ${url}`);

        fetch(url, options)
            .then(res => res.json())
            .then(json => {
                const fetchedGenres = json.genres || [];
                setGenres(fetchedGenres);
            })
            .catch(err => {
                console.error('Genres API error:', err);
                setGenres([]);
            });
    };

    const performSearch = (page = 1) => {
        const searchUrl = `https://api.themoviedb.org/3/search/movie?api_key=${token}&query=${search}&include_adult=false&language=en-US&page=${page}&per_page=10`;
        console.log(`Performing search with URL: ${searchUrl}`);

        fetch(searchUrl, options)
            .then(res => {
                if (!res.ok) {
                    throw new Error('Network response was not ok');
                }
                return res.json();
            })
            .then(searchData => {
                setResults(searchData.results.slice(0, 10) || []);
                setCurrentPage(searchData.page || 1);
                setTotalPages(Math.ceil(searchData.total_results / 10) || 1);
                console.log(searchData);
                setCurrentSearch('normal');
            })
            .catch(err => {
                console.error('Search API error:', err);
                setResults([]);
            });
    };

    const performAdvancedSearch = (page = 1) => {
        const searchUrl = `https://api.themoviedb.org/3/discover/movie?api_key=${token}&include_adult=false&include_video=false&language=en-US&page=${page}&sort_by=${selectedSort}&with_genres=${selectedGenre}&year=${selectedYear}&per_page=10`;
        console.log(`Performing advanced search with URL: ${searchUrl}`);

        fetch(searchUrl, options)
            .then(res => res.json())
            .then(searchData => {
                const fetchedResults = searchData.results.slice(0, 10) || [];
                setResults(fetchedResults);
                setCurrentPage(searchData.page || 1);
                setTotalPages(Math.ceil(searchData.total_results / 10) || 1);
                setCurrentSearch('advanced');
            })
            .catch(err => console.error(err));
    };

    const fetchPopularMovies = (page = 1) => {
        const popularMoviesUrl = `https://api.themoviedb.org/3/movie/popular?api_key=${token}&language=en-US&page=${page}&per_page=10`;
        console.log(`Fetching popular movies with URL: ${popularMoviesUrl}`);

        fetch(popularMoviesUrl, options)
            .then(res => res.json())
            .then(searchData => {
                const fetchedResults = searchData.results.slice(0, 10) || [];
                setResults(fetchedResults);
                setCurrentPage(searchData.page || 1);
                setTotalPages(Math.ceil(searchData.total_results / 10) || 1);
                setCurrentSearch('popular');
            })
            .catch(err => console.error('Popular Movies API error:', err));
    };

    const handleAddFavourite = (movie) => {
        console.log(`Adding ${movie.title} to favourites`);
        // Your logic to handle adding the movie to favourites
    };

    useEffect(() => {
        getGenres();
        fetchPopularMovies();
    }, []);

    const goToPage = (page) => {
        if (currentSearch === 'normal') {
            performSearch(page);
        } else if (currentSearch === 'advanced') {
            performAdvancedSearch(page);
        } else if (currentSearch === 'popular') {
            fetchPopularMovies(page);
        }
    };

    return (
        <div className="container">
            <header>
                <div className='search-bar'>
                    <input type="text" id="searchInput" value={search} onChange={updateSearch} placeholder="Elokuvan nimi..." />
                    <button onClick={() => performSearch(1)}>Hae hakusanalla</button>
                </div>
                <label htmlFor="sortBy">Järjestä: </label>
                <select id="sortBy" name="sortBy" value={selectedSort} onChange={handleSortChange}>
                    <option value=""></option>
                    <option value="original_title.asc">Original Title (A-Z)</option>
                    <option value="original_title.desc">Original Title (Z-A)</option>
                    <option value="popularity.asc">Popularity (Ascending)</option>
                    <option value="popularity.desc">Popularity (Descending)</option>
                    <option value="revenue.asc">Revenue (Ascending)</option>
                    <option value="revenue.desc">Revenue (Descending)</option>
                    <option value="primary_release_date.asc">Release Date (Oldest)</option>
                    <option value="primary_release_date.desc">Release Date (Newest)</option>
                    <option value="vote_average.asc">Vote Average (Lowest)</option>
                    <option value="vote_average.desc">Vote Average (Highest)</option>
                    <option value="vote_count.asc">Vote Count (Lowest)</option>
                    <option value="vote_count.desc">Vote Count (Highest)</option>
                </select>
                <label htmlFor="genres">Genre: </label>
                <select id="genres" name="genres" value={selectedGenre} onChange={handleGenreChange}>
                    <option value=""></option>
                    {genres?.map((item, index) => (
                        <option key={index} value={item.id}>{item.name}</option>
                    ))}
                </select>
                <label htmlFor='searchYear'>Vuosi: </label>
                <input type="number" id="searchYear" value={selectedYear} onChange={handleYearChange} placeholder="2024" />
                <button onClick={() => performAdvancedSearch(1)}>Hae rajauksilla</button>
                <button onClick={() => fetchPopularMovies(1)}>Suosittuja elokuvia</button>
            </header>
            <div className="results">
                {results?.map((item, index) => (
                    <div className="result-card" key={index}>
                        <h2 onClick={() => navigate(`/movie/${item.id}`)}>{item.title}</h2>
                        <img src={`https://image.tmdb.org/t/p/w500${item.poster_path}`} alt={item.title} onError={(e) => { e.target.onError = null; e.target.src = "./default.JPG"; }} />
                        <button className="add-favourite-button" onClick={() => handleAddFavourite(item)}>Lisää suosikkilistalleni</button>
                    </div>
                ))}
            </div>
            <div className="pagination">
                <button onClick={() => goToPage(currentPage - 1)} disabled={currentPage === 1}>Edellinen</button>
                <span>Sivu {currentPage} / {totalPages}</span>
                <button onClick={() => goToPage(currentPage + 1)} disabled={currentPage === totalPages}>Seuraava</button>
            </div>
        </div>
    );
}

export default Search;
