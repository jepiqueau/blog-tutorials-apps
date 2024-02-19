import "reflect-metadata";
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

import { JeepSqlite } from 'jeep-sqlite/dist/components/jeep-sqlite';
import { defineCustomElements as pwaElements} from '@ionic/pwa-elements/loader';
import sqliteParams from './databases/sqliteParams';
import {initializeDataSources} from './databases/utilities';

pwaElements(window);
customElements.define('jeep-sqlite', JeepSqlite);

const rootRender = async () => {

  await initializeDataSources();

  const container = document.getElementById('root');
  const root = createRoot(container!);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}
if (sqliteParams.platform !== "web") {
  rootRender();
} else {
  window.addEventListener('DOMContentLoaded', async () => {
      // Create the "jeep-sqlite" web component
      const jeepEl = document.createElement("jeep-sqlite");
      // Set the style for the button
      //to pick or save the database from/to local disk
      jeepEl.buttonOptions = '{"backgroundColor":"#fb2a2a", "top":"70%","fontSize":"1.1em"}';
      document.body.appendChild(jeepEl);
      customElements.whenDefined('jeep-sqlite').then(async () => {
        await sqliteParams.connection.initWebStore();
        rootRender();
      })
      .catch ((err) => {
        console.log(`Error: ${err}`);
        throw new Error(`Error: ${err}`)
      });
  });
}
