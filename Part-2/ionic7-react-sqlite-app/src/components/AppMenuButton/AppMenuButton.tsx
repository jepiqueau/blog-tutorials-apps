import { FC } from 'react';
import './AppMenuButton.css';
import { IonMenuButton } from '@ionic/react';

interface AppMenuButtonProps {}

const AppMenuButton: FC<AppMenuButtonProps> = () => {
  return (
    <IonMenuButton slot="end" />
  )
};

export default AppMenuButton;
