import React from 'react';
import './AppLogo.css';

interface AppLogoProps {}

const AppLogo: React.FC<AppLogoProps> = () => (
  <div className="AppLogo">
    <img src="assets/JeepQLogo.png" width="128" height="128" />
  </div>
);

export default AppLogo;