import { Component, OnInit } from '@angular/core';
import { DestinoViaje } from './../models/destino-viaje.model';

@Component({
  selector: 'app-lista-destinos',
  templateUrl: './lista-destinos.component.html',
  styleUrls: ['./lista-destinos.component.css']
})
export class ListaDestinosComponent implements OnInit {
  destinos: string[];
  destinos1: string[];
  constructor() {
  	this.destinos = [];//se deja vacio ya que se esta cargarndo con el formulario
  	this.destinos = ["uno","dos","tres","cuatro"]
   }

  ngOnInit(): void {
  }
 guardar(nombre, url): boolean{
 	this.destinos.push(new DestinoViaje(nombre, url));
 	return false;
 }
}
