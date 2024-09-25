import React, { useEffect, useRef } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import config from './config.json'; // Import your config file

const root = ReactDOM.createRoot(document.getElementById('root'));

const Main = () => {
  
  const hasFetched = useRef(false); // Create a ref to track fetch status

  useEffect(() => {
    if (!hasFetched.current) {
      hasFetched.current = true; // Set the flag to true

      document.title = config.appName; // Set the title from config.json

      const metaDescription = document.querySelector('meta[name="description"]');
      if (metaDescription) {
        metaDescription.setAttribute("content", config.description);
      }

      const iconHref = document.querySelector('link[rel="icon"]');
      if (iconHref) {
        iconHref.setAttribute("href", config.appIcon);
      }
    }

  }, []);

  return <App />;
};

root.render(
  <React.StrictMode>
    <Main />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();