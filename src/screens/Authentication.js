import './Authentication.css';
import React from 'react';
import { Link } from 'react-router-dom'

const Authentication = () => {
  return (
    <div className="authentication-page">
      <h1>Authentication Page</h1>
      <Link to="/">Back</Link>
    </div>
  );
};

export default Authentication;
