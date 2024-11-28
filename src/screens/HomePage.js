import React from 'react';
import Navbar from '../components/Navbar';
import GroupCreator from '../components/GroupCreator';
import Search from '../components/Search';
import ReviewList from '../components/ReviewList';

const HomeScreen = ({ isDarkMode, isLoggedIn }) => {
  return (
    <div className={`home ${isDarkMode ? 'dark-mode' : ''}`}>
      <Navbar isLoggedIn={isLoggedIn} />
      <div className="main-content container mt-5">
        <div className="row">
          <div className="col-12 col-md-12 group-creator-container">
            <GroupCreator isLoggedIn={isLoggedIn} />
          </div>
          <div className="col-12 col-md-12">
            <div className="search-container">
              <Search />
            </div>
            <div className="review-list-container">
              <ReviewList />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeScreen;
