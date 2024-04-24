import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideAnimations } from '@angular/platform-browser/animations';
import {
  provideRouter,
  withEnabledBlockingInitialNavigation,
  withHashLocation,
  withInMemoryScrolling,
  withRouterConfig,
  withViewTransitions
} from '@angular/router';

import { DropdownModule, SidebarModule } from '@coreui/angular';
import { IconSetService } from '@coreui/icons-angular';
import { routes } from './app.routes';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { SecurityInterceptorService } from './core/interceptors/security.interceptor.service';
import { ToastrModule } from 'ngx-toastr';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes,
      withRouterConfig({
        onSameUrlNavigation: 'reload'
      }),
      withInMemoryScrolling({
        scrollPositionRestoration: 'top',
        anchorScrolling: 'enabled'
      }),
      withEnabledBlockingInitialNavigation(),
      withViewTransitions(),
      withHashLocation()
    ),
    importProvidersFrom(
      SidebarModule, 
      DropdownModule, 
      HttpClientModule,
      ToastrModule.forRoot()),
     // Aquí agregas el HTTP_INTERCEPTORS con tu SecurityInterceptorService
     {
      provide: HTTP_INTERCEPTORS,
      useClass: SecurityInterceptorService,
      multi: true,
    },
    IconSetService,
    provideAnimations()
  ]
};