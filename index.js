import React from 'react';
import ReactDOM from 'react-dom/client';
import App from "./src/FileUpload";

// Add the new ReactDOM.createRoot code
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);