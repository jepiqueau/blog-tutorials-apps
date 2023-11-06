import React, { FC } from 'react';
import './AppMenu.css';
import { IonMenu, IonHeader, IonToolbar, IonTitle, IonContent,
         IonList, IonItem, IonButton} from '@ionic/react';

interface AppMenuProps {}

const AppMenu: FC<AppMenuProps> = () => {
  const closeMenu = () => {
    const menu = document.querySelector('ion-menu');
    menu!.close();
  };

  return (
    <IonMenu className="AppMenu" side="end" contentId="main-content">
      <IonHeader>
        <IonToolbar>
          <IonTitle>Menu Content</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonList>
          <IonItem onClick={closeMenu}>
            <IonButton size="default" routerLink="/users" expand="full">Managing Users</IonButton>
          </IonItem>
          {/* ... other menu items */}
        </IonList>
      </IonContent>
    </IonMenu>
  )
};
export default AppMenu;
