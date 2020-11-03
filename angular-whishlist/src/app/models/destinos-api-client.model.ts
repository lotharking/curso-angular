import { forwardRef, Inject, Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppConfig, AppState, APP_CONFIG, db } from '../app.module';
import { DestinoViaje } from './destino-viaje.model';
import { ElegidoFavoritoAction, NuevoDestinoAction } from './destinos-viajes-state.model';
import { HttpClient, HttpClientModule, HttpHeaders, HttpRequest, HttpResponse } from '@angular/common/http';

@Injectable()
export class DestinosApiClient {
	destino: DestinoViaje[] = [];
	
	constructor(
		private store: Store<AppState>,
		@Inject(forwardRef(() => APP_CONFIG)) private config: AppConfig,
		private http: HttpClient
		) {
        this.store
          .select(state => state.destinos)
          .subscribe((data) => {
              console.log('destinos sub store');
              console.log(data);
              this.destino = data.items;
          });
        this.store
          .subscribe((data) => {
              console.log('all store');
              console.log(data);
          });
	}

	//crea un request y se suscribe a la respuesta de ese request(linea 35)
	add(d: DestinoViaje) {//add se activa con el boton guardar, por eso aduiere el dato y lo manda al "servidor" que se creo
		const headers: HttpHeaders = new HttpHeaders({ 'X-API-TOKEN': 'token-seguridad' });//token enviado por headers(tecnica muy usada)- pero no se valida, eso solo ejemplo
		const req = new HttpRequest('POST', this.config.apiEndpoint + '/my', { nuevo: d.nombre }, { headers: headers });
		this.http.request(req).subscribe((data: HttpResponse<{}>) => {
			if (data.status === 200) {//si el servidor responde ok
				this.store.dispatch(new NuevoDestinoAction(d));
				const myDb = db;
				myDb.destinos.add(d);
				console.log('Todos los destinos de la db!');
				myDb.destinos.toArray().then(destinos => console.log(destinos));//to Array funciona como una promesa, entonces cuando lleguen la respuesta de la promesa, reciben los detinos y los loggea
			}else{
				console.log('Error envio de datos');
			}
		});
	}

	getById(id: String): DestinoViaje {
		return this.destino.filter(function(d) { return d.id.toString() === id; })[0];
	  }
	
	  getAll(): DestinoViaje[] {
		return this.destino;
	  }

	elegir(d: DestinoViaje) {
		//aqui incovariamos el servidor
		this.store.dispatch(new ElegidoFavoritoAction(d));
	}	
}