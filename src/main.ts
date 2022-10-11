import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';
import fireBase from 'firebase/compat/app';
import 'firebase/compat/auth'

if (environment.production) {
  enableProdMode();
}

fireBase.initializeApp(environment.firebase)

let appInit = false;

fireBase.auth().onAuthStateChanged(() => {
  if(!appInit) {
    platformBrowserDynamic().bootstrapModule(AppModule)
    .catch(err => console.error(err));
  }
  appInit = true
})

