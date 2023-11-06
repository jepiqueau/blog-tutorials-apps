import { enableProdMode, importProvidersFrom, APP_INITIALIZER } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { RouteReuseStrategy, provideRouter } from '@angular/router';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { routes } from './app/app.routes';
import { AppComponent } from './app/app.component';
import { environment } from './environments/environment';
import { defineCustomElements as pwaElements} from '@ionic/pwa-elements/loader';
import { defineCustomElements as jeepSqlite} from 'jeep-sqlite/loader';
import { Capacitor } from '@capacitor/core';
import { InitializeAppService } from './app/services/initialize.app.service';
import { SQLiteService } from './app/services/sqlite.service';
import { StorageService } from './app/services/storage.service';
import { DbnameVersionService } from './app/services/dbname-version.service';

if (environment.production) {
  enableProdMode();
}
// --> Below only required if you want to use a web platform
const platform = Capacitor.getPlatform();
if(platform === "web") {
  // Web platform
  // required for toast component in Browser
  pwaElements(window);

  // required for jeep-sqlite Stencil component
  // to use a SQLite database in Browser
  jeepSqlite(window);

  window.addEventListener('DOMContentLoaded', async () => {
      const jeepEl = document.createElement("jeep-sqlite");
      document.body.appendChild(jeepEl);
      jeepEl.autoSave = true;
  });
}
// Above only required if you want to use a web platform <--

export function initializeFactory(init: InitializeAppService) {
  return () => init.initializeApp();
}

bootstrapApplication(AppComponent, {
  providers: [SQLiteService,
    InitializeAppService,
    StorageService,
    DbnameVersionService,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    importProvidersFrom(IonicModule.forRoot({})),
    provideRouter(routes),
    {
      provide: APP_INITIALIZER,
      useFactory: initializeFactory,
      deps: [InitializeAppService],
      multi: true
    }
  ],
});
