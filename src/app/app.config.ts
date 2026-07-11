import { ApplicationConfig, APP_INITIALIZER } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';

import { routes } from './app.routes';

import AOS from 'aos';


export function initAOS() {
  return () => {
    AOS.init({
      duration: 1000,
      once: true,
      offset: 100
    });
  };
}


export const appConfig: ApplicationConfig = {

  providers: [

    provideRouter(routes),

    provideHttpClient(),

    {
      provide: APP_INITIALIZER,
      useFactory: initAOS,
      multi: true
    }

  ]

};