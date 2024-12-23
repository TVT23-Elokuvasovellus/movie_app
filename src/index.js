import React, { useEffect, useState } from 'react'
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { pingServer } from './pingServer';
import reportWebVitals from './reportWebVitals';
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/index.css';

import ErrorPage from './screens/ErrorPage';
import Home from './screens/HomePage';
import Login from './screens/LoginPage';
import Signup from './screens/SignupPage';
import Review from './screens/Review';
import ProfilePage from './screens/ProfilePage';
import GroupPage from './screens/GroupPage';
import GroupsPage from './screens/GroupsPage';
import Showtimes from './screens/ShowtimesPage'
import MovieInfo from './screens/MovieInfoPage';
import { useAuth } from './hooks/useAuth';
import Movie from './components/Movie';

const App = () => {
  const { isLoggedIn, userId } = useAuth();
  const [isDarkMode] = useState(() => {
    return localStorage.getItem('isDarkMode') === 'true';
  });

  useEffect(() => {
    pingServer();
  }, []);  

  return (
    <div className={`root-container ${isDarkMode ? 'dark-mode' : ''}`}>
      <RouterProvider router={createBrowserRouter([
        {
          path: "/",
          element: <Home isLoggedIn={isLoggedIn} />,
        },
        {
          path: "/login",
          element: <Login />
        },
        {
          path: "/signup",
          element: <Signup />
        },
        {
          path: "/profile/:id", 
          element: <ProfilePage isLoggedIn={isLoggedIn} userId={userId} />
        },
        {
          path: "/group/:id",
          element: <GroupPage isLoggedIn={isLoggedIn} />
        },
        {
          path: "movie/:id",
          element: <MovieInfo isLoggedIn={isLoggedIn} />
        },
        {
          path: "showtimes",
          element: <Showtimes isLoggedIn={isLoggedIn} />
        },
        {
          path: "groups",
          element: <GroupsPage isLoggedIn={isLoggedIn} />
        },
        {
          path: "*",
          element: <ErrorPage />
        }
      ])} />
    </div>
  );
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();