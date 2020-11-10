import { Directive, OnInit, OnDestroy } from '@angular/core';

@Directive({
  selector: '[appEspiame]'
})// las directivas permiten manipular elementos
export class EspiameDirective implements OnInit, OnDestroy {// genera un conteo de cada destino creado (lo destruye al ver el detalle y vuelve a crearlos al regresar al home)
  static nextId = 0;// es estatico para que sea compartida por todas las instancias que la llame
  log = (msg: string) => console.log('Evento ' + (EspiameDirective.nextId++)+ ' ' + (msg));
  ngOnInit() { this.log('#####****** OnInit'); }
  ngOnDestroy() { this.log('#####****** OnDestroy'); }
}
