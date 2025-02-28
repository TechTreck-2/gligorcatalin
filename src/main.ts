import { enableProdMode } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations'; // ✅ Import this
import { AppComponent } from './app/app.component';
import { importProvidersFrom } from '@angular/core';
import { AppRoutingModule } from './app/app-routing.module';
import { CommonModule } from '@angular/common';

if (process.env['NODE_ENV'] === 'production') {
  enableProdMode();
}

bootstrapApplication(AppComponent, {
  providers: [
    importProvidersFrom(CommonModule, AppRoutingModule),
    provideAnimations(), // ✅ Enable animations
  ],
}).catch(err => console.error(err));
