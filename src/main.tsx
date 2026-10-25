import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { TEAM_NAME } from './config/teamConfig';
import './index.css';

document.title = `${TEAM_NAME} - Youth Match & Subs Manager`;

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
