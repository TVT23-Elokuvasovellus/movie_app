import './search.css';
import React, { useState, useEffect } from 'react';

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
        const url = 'https://api.themoviedb.org/3/genre/movie/list?language=en-US';

        fetch(url, options)
            .then(res => res.json())
            .then(json => {
                console.log(json);
                setGenres(json.genres);
            })
            .catch(err => console.error(err));
    };

    const performSearch = (page = 1) => {
        const searchUrl = `https://api.themoviedb.org/3/search/movie?query=${search}&include_adult=false&language=en-US&page=${page}`;

        fetch(searchUrl, options)
            .then(res => res.json())
            .then(searchData => {
                setResults(searchData.results);
                setCurrentPage(searchData.page);
                setTotalPages(searchData.total_pages);
                setCurrentSearch('normal');
            })
            .catch(err => console.error(err));
    };

    const performAdvancedSearch = (page = 1) => {
        const searchUrl = `https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=en-US&page=${page}&sort_by=${selectedSort}&with_genres=${selectedGenre}&year=${selectedYear}`;
        fetch(searchUrl, options)
        .then(res => res.json())
        .then(searchData => {
            setResults(searchData.results);
            setCurrentPage(searchData.page);
            setTotalPages(searchData.total_pages);
            setCurrentSearch('advanced');
        })
        .catch(err => console.error(err));
    }

    useEffect(() => {
        getGenres();
    }, []);

    const goToPage = (page) => {
        if (currentSearch === 'normal'){
            performSearch(page)
        } else {
            performAdvancedSearch(page);
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
                    placeholder="Type to search..." 
                />
                <button onClick={() => performSearch(1)}>Search</button>
                </div>
                <label htmlFor="sortBy">Sort by: </label>
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
                    {genres.map((item, index) => (
                        <option key={index} value={item.id}>{item.name}</option>
                    ))}
                </select>
                <label htmlFor='searchYear'>Year: </label>
                <input 
                    type="number" 
                    id="searchYear" 
                    value={selectedYear} 
                    onChange={handleYearChange} 
                    placeholder="2024" 
                />
                <button onClick={() => performAdvancedSearch(1)}>Advanced Search</button>
            </header>
            <h1>Results</h1>
            <div className="results">
                {results.map((item, index) => (
                    <div className="result-card" key={index}>
                        <h2>{item.title}</h2>
                        <img 
                            src={`https://image.tmdb.org/t/p/w500${item.poster_path}`} 
                            alt={item.title} 
                            onError={(e) => {
                                e.target.onError = null;
                                e.target.src = "img/default.JPG";
                            }}
                        />
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
