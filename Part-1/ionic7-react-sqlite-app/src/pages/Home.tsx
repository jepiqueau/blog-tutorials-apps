import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import AppLogo from '../components/AppLogo/AppLogo';
import AppMenuButton from '../components/AppMenuButton/AppMenuButton';
import './Home.css';
import AppIntroText from '../components/AppIntroText/AppIntroText';

const Home: React.FC = () => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <AppMenuButton />
          <IonTitle>Home</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <div id="container">
          <AppLogo />
          <AppIntroText />
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Home;
