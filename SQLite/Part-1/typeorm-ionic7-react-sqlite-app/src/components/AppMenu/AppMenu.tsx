import React from 'react';
import './AppMenu.css';
import { IonMenu, IonHeader, IonToolbar, IonTitle, IonContent, IonLabel,
         IonList, IonItem, IonButton, IonItemGroup, IonItemDivider} from '@ionic/react';

interface AppMenuProps {}

const AppMenu: React.FC<AppMenuProps> = () => {
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
          <IonItemGroup>
            <IonItemDivider>
              <IonLabel class="menu-ion-label">Authors DB</IonLabel>
            </IonItemDivider>
            <IonItem onClick={closeMenu}>
              <IonButton size="default" routerLink="/authors" expand="full">Author's List</IonButton>
            </IonItem>
          </IonItemGroup>
          <IonItemGroup>
            <IonItemDivider>
              <IonLabel class="menu-ion-label">Users DB</IonLabel>
            </IonItemDivider>
            <IonItem onClick={closeMenu}>
              <IonButton size="default" routerLink="/users" expand="full">User's List</IonButton>
            </IonItem>
          </IonItemGroup>
          {/* ... other menu items */}
        </IonList>
      </IonContent>
    </IonMenu>
  )
};
export default AppMenu;
