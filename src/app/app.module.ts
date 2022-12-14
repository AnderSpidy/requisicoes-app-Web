import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { AngularFireModule} from '@angular/fire/compat';
import { AngularFireAuthModule} from '@angular/fire/compat/auth';
import { AngularFirestoreModule} from '@angular/fire/compat/firestore';



import { environment } from 'src/environments/environment';
import { LoginComponent } from './auth/login/login.component';
import { ReactiveFormsModule } from '@angular/forms';
import { AuthenticationService } from './auth/services/authentication.service';
import { PainelComponent } from './painel/painel.component';
import { NavbarComponent } from './navbar/navbar.component';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';

// fazendo como o tiago fez utilizando a biblioteca nativa do angular pra usar o pipe no preco
import ptBR from '@angular/common/locales/pt';
import { registerLocaleData } from '@angular/common';
import { LOCALE_ID,DEFAULT_CURRENCY_CODE} from '@angular/core';

registerLocaleData(ptBR);

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    PainelComponent,
    NavbarComponent
    ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    NgbModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireAuthModule,
    AngularFirestoreModule,

    BrowserAnimationsModule,
    ToastrModule.forRoot()//dentro do forroot eu poderia colocar as configurações do toastr, como posicionamento, timout emfim, mas no momento eu estou fazendo diretamente quando chamo a função

  ],
  providers: [
    AuthenticationService,
    {provide: LOCALE_ID, useValue: "pt"},
    {provide: DEFAULT_CURRENCY_CODE, useValue: "BRL"}],
  bootstrap: [AppComponent]
})
export class AppModule { }

//singleton é basicamente deixar uma instancia para cada objeto
