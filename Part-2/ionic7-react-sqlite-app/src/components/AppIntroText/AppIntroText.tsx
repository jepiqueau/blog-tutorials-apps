import React, { FC } from 'react';
import './AppIntroText.css';

interface AppIntroTextProps {}

const AppIntroText: FC<AppIntroTextProps> = () => (
  <div className="AppIntroText">
    <h3>
      Welcome to the Ionic7/React SQLite Database CRUD App Example Tutorial
    </h3>
    <h4>using @capacitor-community/sqlite</h4>
  </div>
);

export default AppIntroText;
