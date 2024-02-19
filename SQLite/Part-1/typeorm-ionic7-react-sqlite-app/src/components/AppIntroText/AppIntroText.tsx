import React from 'react';
import './AppIntroText.css';

interface AppIntroTextProps {}

const AppIntroText: React.FC<AppIntroTextProps> = () => (
  <div className="AppIntroText">
    <div id="app-intro-header">
      <h3>
        Welcome to the Ionic7/React/Vite TypeOrm SQLite Database App Example Tutorial
      </h3>
      <h4>using @capacitor-community/sqlite</h4>
    </div>
    <div id="app-intro-content">
      <p>The purpose is to demonstrate the basic setup of the App. </p>
      <p>The CRUD methods could be implemented from there</p>
    </div>
  </div>
);

export default AppIntroText;