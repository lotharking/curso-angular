import { Injectable } from '@angular/core';
import { Action } from '@ngrx/store';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { DestinoViaje } from './destino-viaje.model';
import { DestinosApiClient } from './destinos-api-client.model';
import { HttpClientModule, HttpHeaders, HttpRequest, HttpResponse } from '@angular/common/http';
import { REFRESH } from '@ngrx/store-devtools/src/actions';

// ESTADO -- global de la aplicacion
export interface DestinosViajesState {
    items: DestinoViaje[];
    loading: boolean; 
    favorito: DestinoViaje;
    increment: number;
}

// export const initializeDestinosViajesState = function() { // Son lo mismo
export function initializeDestinosViajesState() { // Manejo del estado
  return {
    items: [],//InitMyDataAction esta vacio porque es un llamado asincronico, de ser sincronico estaria haciendo el llamado del metodo desde el module, pero como es asincronico, se hace la espera a que sea llamado por peticion
    loading: false,
    favorito: null,
    increment: 0
  };
};

// ACCIONES -- modifican el estado (interaccion del usuario)
export enum DestinosViajesActionTypes {
    NUEVO_DESTINO = '[Destinos Viajes] Nuevo',
    ELEGIDO_FAVORITO = '[Destinos Viajes] Favorito',
    VOTE_UP = '[Destinos Viajes] Vote Up',
    VOTE_DOWN = '[Destinos Viajes] Vote Down',
    REFRESH = '[Destinos Viajes] Refresh',
    INIT_MY_DATA = '[Destinos Viajes] Init My Data',
    TRACKINGTAGS = '[Number] trackingTags'
  }
  
  export class NuevoDestinoAction implements Action {
    type = DestinosViajesActionTypes.NUEVO_DESTINO;
    constructor(public destino: DestinoViaje) {}
  }
  
  export class ElegidoFavoritoAction implements Action {
    type = DestinosViajesActionTypes.ELEGIDO_FAVORITO;
    constructor(public destino: DestinoViaje) {}
  }
  
  export class VoteUpAction implements Action {
    type = DestinosViajesActionTypes.VOTE_UP;
    constructor(public destino: DestinoViaje) {}
  }
  
  export class VoteDownAction implements Action {
    type = DestinosViajesActionTypes.VOTE_DOWN;
    constructor(public destino: DestinoViaje) {}
  }
  
  export class RefreshAction implements Action {
    type = DestinosViajesActionTypes.REFRESH;
    constructor(public destino: DestinoViaje) {}
  }

  export class InitMyDataAction implements Action {
    type = DestinosViajesActionTypes.INIT_MY_DATA;
    constructor(public destinos: string[]) {}
  }

  export class TrackingTagsAction implements Action {
    type = DestinosViajesActionTypes.TRACKINGTAGS;
    constructor() {}
  }

  export type DestinosViajesActions = NuevoDestinoAction | ElegidoFavoritoAction
  | VoteUpAction | VoteDownAction | RefreshAction | InitMyDataAction | TrackingTagsAction; // Variable de todas las acciones sobre DestinosViajes

  let contador = 0;
  // REDUCERS -- Cada que se dispara una accion son llamados (con una accion y estado del sistema generan nuevo estado)
export function reducerDestinosViajes(
    state: DestinosViajesState,
    action: DestinosViajesActions
  ): DestinosViajesState {
    switch (action.type) {
      case DestinosViajesActionTypes.INIT_MY_DATA: {
        const destinos: string[]= (action as InitMyDataAction).destinos;
        return {
            ...state,
            items: destinos.map((d) => new DestinoViaje(d, ''))
          };
        }
      case DestinosViajesActionTypes.NUEVO_DESTINO: {
        return {
            ...state,
            items: [...state.items, (action as NuevoDestinoAction).destino ]
          };
      }
      case DestinosViajesActionTypes.ELEGIDO_FAVORITO: {
        state.items.forEach(x => x.setSelected(false));
        const fav: DestinoViaje = (action as ElegidoFavoritoAction).destino;
        fav.setSelected(true);
        return {
          ...state,
          favorito: fav
        };
    }      
      case DestinosViajesActionTypes.VOTE_UP: {
        const d: DestinoViaje = (action as VoteUpAction).destino;
        d.voteUp();
        return { ...state };
    }
      case DestinosViajesActionTypes.VOTE_DOWN: {
        const d: DestinoViaje = (action as VoteDownAction).destino;
        d.voteDown();
        return { ...state };
    }
      case DestinosViajesActionTypes.REFRESH: {
        const d: DestinoViaje = (action as RefreshAction).destino;
        d.refresh();
        return { ...state };
    }
      case DestinosViajesActionTypes.TRACKINGTAGS: {
        const d = (action as TrackingTagsAction);
        contador++;
        return { ...state, increment: contador };
    }
  }
  return state; 
}

// EFFECTS -- Registrar una nueva accion como consecuencia de otra acción. (dada acción acciona otra acción)
@Injectable()
export class DestinosViajesEffects {  
  @Effect()
  nuevoAgregado$: Observable<Action> = this.actions$.pipe(
    ofType(DestinosViajesActionTypes.NUEVO_DESTINO),
    map((action: NuevoDestinoAction) => new ElegidoFavoritoAction(action.destino)) // Map ayuda a pasar un objeto a otro
  );

  constructor(private actions$: Actions) {}
}
