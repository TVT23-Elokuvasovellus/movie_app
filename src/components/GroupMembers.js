import React from 'react';

const Movie = ({ show, onSelectMovie, selectedMovieId }) => {
  const isChecked = selectedMovieId === show.ID;

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('fi-FI');
  };

  const formatTime = (dateString) => {
    const options = { hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleTimeString([], options).replace(':', '.');
  };

  const handleCheck = () => {
    onSelectMovie(isChecked ? null : show.ID);
  };

  return (
    <div className="movie">
      <input 
        type="checkbox" 
        checked={isChecked} 
        onChange={handleCheck} 
        className="movie-checkbox"
      />
      <img
        src={show.Images?.EventSmallImagePortrait}
        alt="Event Image"
        className="movie-img"
        onClick={handleCheck}
      />
      <h2>{show.Title}</h2>
      <p><strong>Näytösaika: </strong>{formatTime(show.dttmShowStart)} - {formatTime(show.dttmShowEnd)}, {formatDate(show.dttmShowStart)}</p>
      <p><strong>Kesto: </strong>{show.LengthInMinutes} minuuttia</p>
      <p>{show.TheatreAndAuditorium}</p>
      <p>{show.Genres}</p>
      <div className="ratings">
        <div className="ratings-container">
          <div className="age-rating">
            <img src={show.RatingImageUrl} alt="Age Rating" />
          </div>
          <ul className="content-ratings">
            {show.ContentDescriptors && show.ContentDescriptors.map((descriptor, index) => (
              <li key={index}><img src={descriptor.ImageURL} alt={descriptor.Name} /></li>
            ))}
          </ul>
        </div>
      </div>
      <p><strong>Puhuttu kieli:</strong> {show.SpokenLanguage?.Name || 'N/A'}</p>
      <p><strong>Tekstitykset:</strong> {show.SubtitleLanguage1?.Name || 'N/A'}, {show.SubtitleLanguage2?.Name || 'N/A'}</p>
      <p>{show.PresentationMethod}</p>
    </div>
  );
};

export default Movie;
