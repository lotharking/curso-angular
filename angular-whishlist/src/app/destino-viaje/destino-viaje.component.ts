import { Component, OnInit, Input, HostBinding, EventEmitter, Output } from '@angular/core';
import { DestinoViaje } from './../models/destino-viaje.model';

@Component({
  selector: 'app-destino-viaje',
  templateUrl: './destino-viaje.component.html',
  styleUrls: ['./destino-viaje.component.css']
})
export class DestinoViajeComponent implements OnInit {
	@Input() destino: DestinoViaje;
	@Input('idx') position: number;//el idx la renombra pero no es recomendable
	@HostBinding('attr.class') cssClass = "col-md-4";//para modificar la clase que engloba todo
  @Output() clicked: EventEmitter<DestinoViaje>;

  constructor() {
    this.clicked = new EventEmitter();
  }

  ngOnInit() {
  }

  ir() {
    this.clicked.emit(this.destino);
    return false;
  }

}
