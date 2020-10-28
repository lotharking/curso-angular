import { Component, OnInit, Input, HostBinding, EventEmitter, Output } from '@angular/core';
import { DestinoViaje } from './../../models/destino-viaje.model';
import { Store } from '@ngrx/store';
import { AppState } from '../../app.module';
import { VoteUpAction, VoteDownAction, RefreshAction } from '../../models/destinos-viajes-state.model';

@Component({
  selector: 'app-destino-viaje',
  templateUrl: './destino-viaje.component.html',
  styleUrls: ['./destino-viaje.component.css']
})
export class DestinoViajeComponent implements OnInit {
	@Input() destino: DestinoViaje;//nombre puede ser pasado como parametro a las plantillas del componente
	@Input('idx') position: number;//el idx la renombra pero no es recomendable
	@HostBinding('attr.class') cssClass = "col-md-4";//para modificar la clase que engloba todo
  @Output() clicked: EventEmitter<DestinoViaje>;

  constructor(private store: Store<AppState>) {
    this.clicked = new EventEmitter();
  }

  ngOnInit() {
  }

  ir() {
    this.clicked.emit(this.destino);
    return false; // para que la pagina no se refresque
  }

  voteUp() {
    this.store.dispatch(new VoteUpAction(this.destino));
    return false;
  }

  voteDown() {
    this.store.dispatch( new VoteDownAction(this.destino));
    return false;
  }

  reset() {
    this.store.dispatch( new RefreshAction(this.destino));
    return false;    
  }

}
