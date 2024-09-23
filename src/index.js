import React, { useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import config from './config.json'; // Import your config file

const root = ReactDOM.createRoot(document.getElementById('root'));

const Main = () => {
  useEffect(() => {
    document.title = config.appName; // Set the title from config.json

    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute("content", config.description);
    }

    document.body.style.backgroundColor = "#171717"; // Set the background color here

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
