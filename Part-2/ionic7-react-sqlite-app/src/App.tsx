import React from 'react';
import { Redirect, Route } from 'react-router-dom';
import { IonApp, IonRouterOutlet, setupIonicReact } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import Home from './pages/Home';
import { Capacitor } from '@capacitor/core';
import SqliteService from './services/sqliteService';
import DbVersionService from './services/dbVersionService';
import StorageService  from './services/storageService';
import AppInitializer from './components/AppInitializer/AppInitializer';

import UsersPage from './pages/UsersPage/UsersPage';
import AppMenu from './components/AppMenu/AppMenu';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/* Theme variables */
import './theme/variables.css';

export const platform = Capacitor.getPlatform();

// Singleton Services
export const SqliteServiceContext = React.createContext(SqliteService);
export const DbVersionServiceContext = React.createContext(DbVersionService);
export const StorageServiceContext = React.createContext(new StorageService(SqliteService,DbVersionService));


setupIonicReact();

const App: React.FC = () => {
  return (
    <SqliteServiceContext.Provider value={SqliteService}>
      <DbVersionServiceContext.Provider value={DbVersionService}>
        <StorageServiceContext.Provider value={new StorageService(SqliteService,DbVersionService)}>
          <AppInitializer>
            <IonApp>
              <IonReactRouter>
                <AppMenu />
                <IonRouterOutlet id="main-content">
                  <Route exact path="/home">
                    <Home />
                  </Route>
                  <Route exact path="/">
                    <Redirect to="/home" />
                  </Route>
                  <Route path="/users" component={UsersPage} />
                </IonRouterOutlet>
              </IonReactRouter>
            </IonApp>
          </AppInitializer>
        </StorageServiceContext.Provider>
      </DbVersionServiceContext.Provider>
    </SqliteServiceContext.Provider>
  )
};

export default App;
