import React from 'react';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import AppMenuButton from '../components/AppMenuButton/AppMenuButton';
import AppLogo from '../components/AppLogo/AppLogo';
import AppIntroText from '../components/AppIntroText/AppIntroText';

import './Home.css';

const Home: React.FC = () => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <AppMenuButton />
          <IonTitle>Home</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Home</IonTitle>
          </IonToolbar>
        </IonHeader>
        <div id="container">
          <AppLogo />
          <AppIntroText />
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Home;
