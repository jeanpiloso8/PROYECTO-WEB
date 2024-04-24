/// <reference types="@angular/localize" />

import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { bootstrapApplication } from '@angular/platform-browser';
// import { AppModule } from './app/app.module';
import { AppComponent } from './app/app.component';
import { registerLicense } from '@syncfusion/ej2-base';
import { appConfig } from './app/app.config';

//Actualación archivo de licencia
registerLicense('Ngo9BigBOggjHTQxAR8/V1NBaF5cXmZCf1FpRmJGdld5fUVHYVZUTXxaS00DNHVRdkdnWXxcdXVXQmdfWEZ0XEc=');


// platformBrowserDynamic().bootstrapModule(AppModule)
//   .catch(err => console.error(err));

bootstrapApplication(AppComponent, appConfig)
  .catch(err => console.error(err));

