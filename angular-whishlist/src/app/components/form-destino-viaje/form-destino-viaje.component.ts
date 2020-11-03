import { Component, EventEmitter, forwardRef, Inject, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl, ValidatorFn } from '@angular/forms';
import { DestinoViaje } from './../../models/destino-viaje.model';
import { fromEvent } from 'rxjs';
import { map, filter, debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { ajax, AjaxResponse } from 'rxjs/ajax';
import { AppConfig, APP_CONFIG } from 'src/app/app.module';

@Component({
  selector: 'app-form-destino-viaje',
  templateUrl: './form-destino-viaje.component.html',
  styleUrls: ['./form-destino-viaje.component.css']
})
export class FormDestinoViajeComponent implements OnInit {
  @Output() onItemAdded: EventEmitter<DestinoViaje>;
  fg: FormGroup;
  minLongitud = 3;
  searchResults: string[];
//funciona como una referencia circular con el module, debido a que ambos se retroalimentan para funcionar
  constructor(fb: FormBuilder, @Inject(forwardRef(() => APP_CONFIG)) private config: AppConfig) { //forwardRef-ayuda a funcionar bien la referencia circular
    this.onItemAdded = new EventEmitter;
    this.fg = fb.group({
      nombre: ['', Validators.compose([
        Validators.required,
        this.nombreValidator,
        this.nombreValidatorParametrizable(this.minLongitud)
      ])],
      url: ['']
    });

    this.fg.valueChanges.subscribe((form: any) =>{
      console.log('cambio el formulario: ', form);
    })//registrar un observable(si hay cambio en el texto se activa)
  }

  ngOnInit(): void {
    let elemNombre = <HTMLInputElement>document.getElementById('nombre');
    fromEvent(elemNombre, 'input')//fromEvent genera un observable de eventos de teclado
      .pipe(//escucha cada vez que el ususario toca una tecla
        map((e: KeyboardEvent) => (e.target as HTMLInputElement).value),//cada que teclea una letra el revisa el valor
        filter(text => text.length > 2),//longitud minima de dicha cadena
        debounceTime(120),//revisa la cadena cada 200ms
        distinctUntilChanged(),//no avanza en el dato hasta que llegue un valor diferente
        switchMap((text: string) => ajax(this.config.apiEndpoint + '/ciudades?q=' + text))//hacemos un ajax al apiEndpoint, mandandolo como consulta
      ).subscribe(AjaxResponse => this.searchResults = AjaxResponse.response);//este es quien valida cada que se teclea segun el los datos.
  }

  guardar(nombre: string, url: string): boolean {
    const d = new DestinoViaje(nombre, url);
    this.onItemAdded.emit(d);
    return false;
  }

  nombreValidator(control: FormControl): { [s: string]: boolean }{
    const l = control.value.toString().trim().length;
    if (l > 0 && l < 5){
      return { invalidNombre: true };//si coinside con variable javaScript invalidNombre no necesita ''
    }
    return null;
  }

  //validador parametrizable
  nombreValidatorParametrizable(minLong: number): ValidatorFn {
    return (control: FormControl): { [s: string]: boolean } | null => {
      const l = control.value.toString().trim().length;
      if (l > 0 && l < minLong){
        return { minLongNombre: true };
      }
      return null
    }
  }

}
