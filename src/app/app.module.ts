import { CovidService } from './covid.service';
import { HttpClientModule } from '@angular/common/http';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { environment } from 'src/environments/environment';
import { AngularFireModule } from '@angular/fire';
import { SigninComponent } from './signin/signin.component';
import { WorldwideComponent } from './worldwide/worldwide.component';
import { ChartsModule } from 'ng2-charts';

@NgModule({
  declarations: [
    AppComponent,
    SigninComponent,
    WorldwideComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFirestoreModule,
    HttpClientModule,
    ChartsModule
  ],
  providers: [CovidService],
  bootstrap: [AppComponent]
})
export class AppModule { }
