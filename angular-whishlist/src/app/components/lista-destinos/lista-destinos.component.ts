import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '../../app.module';
import { ElegidoFavoritoAction, NuevoDestinoAction } from '../../models/destinos-viajes-state.model';
import { DestinoViaje } from './../../models/destino-viaje.model';
import { DestinosApiClient } from './../../models/destinos-api-client.model';

@Component({
  selector: 'app-lista-destinos',
  templateUrl: './lista-destinos.component.html',
  styleUrls: ['./lista-destinos.component.css']
})
export class ListaDestinosComponent implements OnInit {
  @Output() onItemAdded: EventEmitter<DestinoViaje>;
  updates: string[] // agrega una linea cada que cambia el elegido como favorito
  all;

  constructor(public destinosApiClient: DestinosApiClient, private store: Store<AppState>) {
    this.onItemAdded = new EventEmitter();
    this.updates = [];
    this.store.select(state => state.destinos.favorito)
      .subscribe(d => {        
        if (d != null){ // es diferente de null porque fue inicializado en null
          this.updates.push('se ha elegido a ' + d.nombre);
        }
      });
      store.select(state => state.destinos.items).subscribe(items => this.all = items);// Cada que cambia items, se los asigna a all
   }

  ngOnInit() {
  }
  agregado(d: DestinoViaje) {
   this.destinosApiClient.add(d);
   this.onItemAdded.emit(d);
 }

 elegido(e: DestinoViaje) {
   this.destinosApiClient.elegir(e);
 }

 getAll() {}

}
