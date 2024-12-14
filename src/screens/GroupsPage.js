import React from 'react';
import Navbar from '../components/Navbar';
import GroupCreator from '../components/GroupCreator';


const GroupsPage = ({ isDarkMode, isLoggedIn }) => {
  return (
    <div>
      <Navbar isLoggedIn={isLoggedIn} />
      <div className="groups-page container mt-5">
        <div className="group-creator-container">
          <GroupCreator isLoggedIn={isLoggedIn} />
        </div>
      </div>
    </div>
  );
};

export default GroupsPage;
