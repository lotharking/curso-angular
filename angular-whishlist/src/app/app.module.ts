import { BrowserModule } from '@angular/platform-browser';
import { APP_INITIALIZER, Injectable, InjectionToken, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { StoreModule as NgRxStoreModule, ActionReducerMap, Store } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { HttpClient, HttpClientModule, HttpHandler, HttpHeaders, HttpRequest } from '@angular/common/http';
import Dexie from 'dexie';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DestinoViajeComponent } from './components/destino-viaje/destino-viaje.component';
import { ListaDestinosComponent } from './components/lista-destinos/lista-destinos.component';
import { DestinoDetalleComponent } from './components/destino-detalle/destino-detalle.component';

import { FormDestinoViajeComponent } from './components/form-destino-viaje/form-destino-viaje.component';
import { DestinosViajesEffects, DestinosViajesState, initializeDestinosViajesState, InitMyDataAction, reducerDestinosViajes } from './models/destinos-viajes-state.model';
import { LoginComponent } from './components/login/login/login.component';
import { ProtectedComponent } from './components/protected/protected/protected.component';
import { UsuarioLogueadoGuard } from './guards/usuario-logueado/usuario-logueado.guard';
import { AuthService } from './services/auth.service';
import { VuelosComponentComponent } from './components/vuelos/vuelos-component/vuelos-component.component';
import { VuelosMainComponentComponent } from './components/vuelos/vuelos-main-component/vuelos-main-component.component';
import { VuelosMasInfoComponentComponent } from './components/vuelos/vuelos-mas-info-component/vuelos-mas-info-component.component';
import { VuelosDetalleComponentComponent } from './components/vuelos/vuelos-detalle-component/vuelos-detalle-component.component';
import { ReservasModule } from './reservas/reservas.module';
import { DestinoViaje } from './models/destino-viaje.model';

// app config- para inyeccion de dependencias
export interface AppConfig{
  apiEndpoint: String;
}

const APP_CONFIG_VALUE: AppConfig = {
  apiEndpoint: 'http://localhost:3000'//el punto donde se va a encontrar para almacenar haciendo los post
}

export const APP_CONFIG = new InjectionToken<AppConfig>('app.config');
//fin app config

//init routing
export const childrenRoutesVuelos: Routes = [
  { path: '', redirectTo: 'main', pathMatch: 'full'},
  { path: 'main', component: VuelosMainComponentComponent},
  { path: 'mas-info', component: VuelosMasInfoComponentComponent},
  { path: ':id', component: VuelosDetalleComponentComponent}
]

const routes: Routes = [//rutas de acceso a la aplicacion
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: ListaDestinosComponent },
  { path: 'destino/:id', component: DestinoDetalleComponent },
  { path: 'login', component: LoginComponent},
  { 
    path: 'protected', 
    component: ProtectedComponent,
    canActivate: [ UsuarioLogueadoGuard ]
  },
  {
    path: 'vuelos',
    component: VuelosComponentComponent,
    canActivate: [ UsuarioLogueadoGuard ],
    children: childrenRoutesVuelos
  }
];
//end routing

// Redux init
export interface AppState {
  destinos: DestinosViajesState;
}

const reducers: ActionReducerMap<AppState> = {
  destinos: reducerDestinosViajes
}

//estado inicial
const reducersInitialState = {
  destinos: initializeDestinosViajesState()
}
// Redux fin init

//app init- se podria crear en otro archivo  parte(averiguar como?)
//sirve para que cuando carge la pagina muestre todos los destinos guardados en el api en el servidor
export function init_app(appLoadService: AppLoadService): () => Promise<any> {
  return () => appLoadService.initializeDestinosViajesState();
}

@Injectable()
class AppLoadService {//al inicializar trae toda la lista del servidor de posibles ciudades
  constructor(private  store: Store<AppState>, private http: HttpClient) {}
  async initializeDestinosViajesState(): Promise<any>{
    const headers: HttpHeaders = new HttpHeaders({'X-API-TOKEN': 'token-seguridad'});
    const req = new HttpRequest('GET', APP_CONFIG_VALUE.apiEndpoint + '/my', { headers: headers });
    const response: any = await this.http.request(req).toPromise();//esperamos respuesta (await) del promise (similar al subscribe)
    this.store.dispatch(new InitMyDataAction(response.body));
  }
}
//fin app init

// dexie db
@Injectable({
  providedIn: "root"
})
export class MyDatabase extends Dexie {
  destinos: Dexie.Table<DestinoViaje, number>;
  constructor () {
    super('MyDatabase');
    this.version(1).stores({
      destinos: '++id, nombre, imagenUrl',
    });
  }
}

export const db = new MyDatabase();
// fin dexie db

@NgModule({
  declarations: [
    AppComponent,
    DestinoViajeComponent,
    ListaDestinosComponent,
    DestinoDetalleComponent,
    FormDestinoViajeComponent,
    LoginComponent,
    ProtectedComponent,
    VuelosComponentComponent,
    VuelosMainComponentComponent,
    VuelosMasInfoComponentComponent,
    VuelosDetalleComponentComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    RouterModule.forRoot(routes),
    NgRxStoreModule.forRoot(reducers, { 
      initialState: reducersInitialState,
      runtimeChecks: {
        strictStateImmutability: false,
        strictActionImmutability: false,
      }
     }),
    EffectsModule.forRoot([ DestinosViajesEffects ]),
    StoreDevtoolsModule.instrument(),
    ReservasModule
  ],
  providers: [
    AuthService, UsuarioLogueadoGuard,
    { provide: APP_CONFIG, useValue: APP_CONFIG_VALUE},//Provide para el ijectiontoken
    AppLoadService, 
    //init_app-una funcion que realiza ciertas tareas cuando se inicializa la aplicacion
    //ejecuta cuando de inicializa, todo lo que esta en init_app,ejecutando la dependencia loadservice, multi true permite varios de inicializacion
    { provide: APP_INITIALIZER, useFactory: init_app, deps: [AppLoadService], multi: true },//APP_INITIALIZER-injectiontoken provicionado por angular para que se ejecute a modo de inicializacion
    MyDatabase
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
