import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';

bootstrapApplication(AppComponent, appConfig)
  .then(() => {
    const splash = document.getElementById('app-loader');
    if (splash) {
      splash.style.opacity = '0'; // fade out (if you add CSS)
      setTimeout(() => splash.remove(), 300); // fully remove after transition
    }
  })
  .catch((err) => console.error(err));