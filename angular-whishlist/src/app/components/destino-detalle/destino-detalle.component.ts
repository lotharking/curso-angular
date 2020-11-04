import { Component, OnInit, InjectionToken, Inject, Injectable } from '@angular/core';
import { inject } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/app.module';
import { DestinoViaje } from '../../models/destino-viaje.model';
import { DestinosApiClient } from '../../models/destinos-api-client.model';

//inicio caso
class DestinosApiClientViejo { // para usar el useExisting tienen que tener funciones compatibles como el getById
  getById(id: String): DestinoViaje {
    console.log('llamando la vieja clase');
    return null;
  }
}
//solicitud de loggear cada vez que se llama el getById
//se crea este metodo debido a que se crea la variable config y se desea asignarle un valor puntual
//InjectionToken- ayuda a injectar el valor especifico, el new asigna cualquier valor
// interface AppConfig {
//   apiEndpoint: string;
// }

// const APP_CONFIG_VALUE: AppConfig = {
//   apiEndpoint: 'mi_api.com'
// };

// const APP_CONFIG = new InjectionToken<AppConfig>('app.config');

@Injectable()
class DestinosApiClientDecorated extends DestinosApiClient {//se herada el destinoapiclient
  // constructor(@Inject(APP_CONFIG) private config: AppConfig, store: Store<AppState>) { //ya hay un store provate que viene heredado, pero si se pasa la variable
  constructor(store: Store<AppState>) { //ya hay un store provate que viene heredado, pero si se pasa la variable
    // super();
    super(store);
  }
  getById(id: string): DestinoViaje {
    console.log('llamando por la clase decorada!');
    // console.log('config: ' + this.config.apiEndpoint);
    return super.getById(id);
  }
}
//fin caso(tener en cuenta providers)

@Component({
  selector: 'app-destino-detalle',
  templateUrl: './destino-detalle.component.html',
  styleUrls: ['./destino-detalle.component.css'],
  providers: [ //anula el comportamiento del providers en el module.ts general
    // DestinosApiClient
    // { provide: APP_CONFIG, useValue: APP_CONFIG_VALUE },//el decorated usa el appconfig
    { provide: DestinosApiClient, useClass: DestinosApiClientDecorated },//el apli client usa el decorado
    { provide: DestinosApiClientViejo, useExisting: DestinosApiClient } //el viejo usa api client
    
    // DestinosApiClient,
    // { provide: DestinosApiClientViejo, useExisting: DestinosApiClient } 
   ] 
})
export class DestinoDetalleComponent implements OnInit {
  destino: DestinoViaje;

  constructor(private route: ActivatedRoute, private destinosApiClient: DestinosApiClientViejo) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    this.destino = this.destinosApiClient.getById(id);
  }

}