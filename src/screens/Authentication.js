import './Authentication.css';
import React from 'react';
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'

const Authentication = () => {
  return (
    <div>
      <Navbar />
      <div className="authentication-page">
        <h1>Authentication Page</h1>
        <Link to="/">Back</Link>
      </div>
    </div>
  );
};

export default Authentication;