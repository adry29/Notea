import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AngularFireModule } from '@angular/fire/compat';
import { environment } from 'src/environments/environment';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import {HttpClient, HttpClientModule} from '@angular/common/http'
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ServiceWorkerModule } from '@angular/service-worker';
import { LocalStorageService } from './services/local-storage.service';
import { AuthService } from './services/auth.service';
import { AuthguardService } from './services/authguard.service';
import { UtilitiesService } from './services/utilities.service';
import { LocationService } from './services/location.service';
import { TextToSpeech } from '@capacitor-community/text-to-speech';
import { Geolocation, GeolocationPlugin } from '@capacitor/geolocation';
import { TexttospeechService } from './services/texttospeech.service';

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [BrowserModule, IonicModule.forRoot(), 
    AppRoutingModule,
    HttpClientModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFirestoreModule,
    FormsModule,
    ReactiveFormsModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: environment.production,
      // Register the ServiceWorker as soon as the app is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000'
    })
  ],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
  LocalStorageService,
  AuthService,
  AuthguardService,
  UtilitiesService,
  LocationService,
  TexttospeechService,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
