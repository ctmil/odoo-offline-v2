import './polyfills.ts';

import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { enableProdMode } from '@angular/core';
import { environment } from './environments/environment';
import { UpgradeModule } from '@angular/upgrade/static';
import { UpgradeAdapter } from '@angular/upgrade';
import { AppModule } from './app/';
//var adapter = new UpgradeAdapter(AppModule);

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic().bootstrapModule(AppModule);
