import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import '../styles/Search.css';

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
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const token = process.env.REACT_APP_API_TOKEN;
    const { user, isLoggedIn } = useAuth();
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

    const certifications = ['G', 'PG', 'PG-13', 'R', 'NC-17'];
    const certificationFilter = certifications.join('|');

    const fetchResults = (url, searchType) => {
        setLoading(true); 
        setError('');
        
        fetch(url, options)
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
                setCurrentSearch(searchType);
            })
            .catch(err => {
                console.error('API error:', err);
                setResults([]);
                setError('An error occurred while fetching search results. Please try again.');
            })
            .finally(() => setLoading(false));
    };

    const performSearch = (page = 1) => {
        const searchUrl = `https://api.themoviedb.org/3/search/movie?api_key=${token}&query=${search}&include_adult=false&language=en-US&page=${page}&per_page=10&certification_country=US&certification=${certificationFilter}`;
        console.log(`Performing search with URL: ${searchUrl}`);
        fetchResults(searchUrl, 'normal');
    };

    const performAdvancedSearch = (page = 1) => {
        const searchUrl = `https://api.themoviedb.org/3/discover/movie?api_key=${token}&include_adult=false&include_video=false&language=en-US&page=${page}&sort_by=${selectedSort}&with_genres=${selectedGenre}&year=${selectedYear}&per_page=10&certification_country=US&certification=${certificationFilter}`;
        console.log(`Performing advanced search with URL: ${searchUrl}`);
        fetchResults(searchUrl, 'advanced');
    };

    const fetchPopularMovies = (page = 1) => {
        const popularMoviesUrl = `https://api.themoviedb.org/3/discover/movie?api_key=${token}&language=en-US&page=${page}&certification_country=US&certification=${certificationFilter}&include_adult=false`;
        console.log(`Fetching popular movies with URL: ${popularMoviesUrl}`);
        fetchResults(popularMoviesUrl, 'popular');
    };

    const handleAddFavorite = (movie) => {
        if (!isLoggedIn) {
            navigate('/login');
            return;
        }

        const payload = {
            ac_id: user?.id,
            mo_id: movie.id,
            movie: movie.title
        };

        const url = 'http://localhost:3001/favorites';

        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            console.log(`Added ${data.movie} to favorites`);
        })
        .catch(error => {
            console.error('Error adding to favorites:', error);
        });
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
                    <input 
                        type="text" 
                        id="searchInput" 
                        value={search} 
                        onChange={updateSearch} 
                        className="search-input" 
                        placeholder="Search By Title..." 
                    />
                    <button className="search-button" onClick={() => performSearch(1)}>Search By Title</button>
                </div>
                <label htmlFor="sortBy">Sort By: </label>
                <select id="sortBy" name="sortBy" value={selectedSort} onChange={handleSortChange} className="sort-by">
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
                <select id="genres" name="genres" value={selectedGenre} onChange={handleGenreChange} className="genres">
                    <option value=""></option>
                    {genres?.map((item, index) => (
                        <option key={index} value={item.id}>{item.name}</option>
                    ))}
                </select>
                <label htmlFor='searchYear'>Year: </label>
                <input 
                    type="number" 
                    id="searchYear" 
                    value={selectedYear} 
                    onChange={handleYearChange} 
                    className="year-input" 
                    placeholder="2024" 
                />
                <button className="search-button" onClick={() => performAdvancedSearch(1)}>Search By Criteria</button>
                <button className="search-button2" onClick={() => fetchPopularMovies(1)}>Popular Movies On TMDB</button>
            </header>
            <div className="results">
                {loading && <p>Loading...</p>}
                {error && <p className="error">{error}</p>}
                {!loading && !error && results?.map((item, index) => (
                    <div className="result-card" key={index}>
                        <Link to={`/movie/${item.id}`} className="movie-title">
                            <h2>{item.title}</h2>
                        </Link>
                        <img 
                            src={`https://image.tmdb.org/t/p/w500${item.poster_path}`} 
                            alt={item.title} 
                            onError={(e) => { 
                                if (!e.target.src.includes('default.JPG')) {
                                    e.target.onerror = null;
                                    e.target.src = "/img/default.JPG";
                                    e.target.classList.add('default-img');
                                }
                            }} 
                        />
                        <button className="add-favorite-button" onClick={() => handleAddFavorite(item)}>Add To Favorites</button>
                    </div>
                ))}
            </div>
            <div className="pagination">
                <button onClick={() => goToPage(currentPage - 1)} disabled={currentPage === 1}>Previous</button>
                <span>Page {currentPage} of {totalPages}</span>
                <button onClick={() => goToPage(currentPage + 1)} disabled={currentPage === totalPages}>Next</button>
            </div>
        </div>
    );
}

export default Search;
