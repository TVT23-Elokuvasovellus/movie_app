import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import Authentication from './screens/Authentication';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import reportWebVitals from './reportWebVitals';
import './index.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import reportWebVitals from './reportWebVitals';
import './index.css';

// Screens
import ErrorPage from './screens/ErrorPage';
import Home from './screens/HomePage';
import Login from './screens/LoginPage';
import Signup from './screens/SignupPage';
import Review from './screens/Review';
import ProfilePage from './screens/ProfilePage';
import GroupPage from './screens/GroupPage';
import { useAuth } from './hooks/useAuth';

const App = () => {
  const { isLoggedIn, userId } = useAuth();
  const [isDarkMode] = useState(() => {
    return localStorage.getItem('isDarkMode') === 'true';
  });

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
          path: "*",
          element: <ErrorPage />
        }
      ])} />
    </div>
  );
};

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/login",
    element: <Authentication />
  },
  {
    path: "/group/:id", 
    element: ""
  },
  {
    path: "*",
    element: <ErrorPage />
  },
  {
    path: "/movie/:id",
    element: <Review />
  }
]);

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
