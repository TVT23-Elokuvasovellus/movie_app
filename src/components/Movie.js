import React from 'react';

const Movie = ({ show }) => {
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('fi-FI');
    };

    const formatTime = (dateString) => {
        const options = { hour: '2-digit', minute: '2-digit' };
        return new Date(dateString).toLocaleTimeString([], options).replace(':', '.');
    };

    return (
        <div className="movie">
            <img src={show.Images?.EventSmallImagePortrait} alt="Event Image" />
            <h2>{show.Title}</h2>
            <p><strong>Näytösaika: </strong>{formatTime(show.dttmShowStart)} - {formatTime(show.dttmShowEnd)}, {formatDate(show.dttmShowStart)}</p>
            <p><strong>Kesto: </strong>{show.LengthInMinutes} minuuttia</p>
            <p>{show.TheatreAndAuditorium}</p>
            <p>{show.Genres}</p>
            <div className="ratings">
                <img src={show.RatingImageUrl} alt="Rating Image" />
                {show.ContentDescriptors && (
                    <ul>
                        {show.ContentDescriptors.map((descriptor, index) => (
                            <li key={index}><img src={descriptor.ImageURL} alt={descriptor.Name} /></li>
                        ))}
                    </ul>
                )}
            </div>
            <p><strong>Puhuttu kieli:</strong> {show.SpokenLanguage?.Name || 'N/A'}</p>
            <p><strong>Tekstitykset:</strong> {show.SubtitleLanguage1?.Name || 'N/A'}, {show.SubtitleLanguage2?.Name || 'N/A'}</p>
            <p>{show.PresentationMethod}</p>
        </div>
    );
};

export default Movie;
