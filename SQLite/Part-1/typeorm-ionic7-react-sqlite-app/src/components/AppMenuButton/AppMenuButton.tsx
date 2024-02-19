import React from 'react';
import './AppMenuButton.css';
import { IonMenuButton } from '@ionic/react';

interface AppMenuButtonProps {}

const AppMenuButton: React.FC<AppMenuButtonProps> = () => {
  return (
    <IonMenuButton slot="end" />
  )
};

export default AppMenuButton;
