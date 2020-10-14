import { Injectable } from '@angular/core';
import { Action } from '@ngrx/store';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { DestinoViaje } from './destino-viaje.model';
import { DestinosApiClient } from './destinos-api-client.model';
import { HttpHeaders, HttpRequest, HttpResponse } from '@angular/common/http';
import { REFRESH } from '@ngrx/store-devtools/src/actions';

// ESTADO -- global de la aplicacion
export interface DestinosViajesState {
    items: DestinoViaje[];
    loading: boolean; 
    favorito: DestinoViaje;
}

export const initializeDestinosViajesState = function() { // Manejo del estado
  return {
    items: [],
    loading: false,
    favorito: null
  };
};

// ACCIONES -- modifican el estado (interaccion del usuario)
export enum DestinosViajesActionTypes {
    NUEVO_DESTINO = '[Destinos Viajes] Nuevo',
    ELEGIDO_FAVORITO = '[Destinos Viajes] Favorito',
    VOTE_UP = '[Destinos Viajes] Vote Up',
    VOTE_DOWN = '[Destinos Viajes] Vote Down',
    REFRESH = '[Destinos Viajes] Refresh'
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

  export type DestinosViajesActions = NuevoDestinoAction | ElegidoFavoritoAction
  | VoteUpAction | VoteDownAction | RefreshAction; // Variable de todas las acciones sobre DestinosViajes

  // REDUCERS -- Cada que se dispara una accion son llamados (con una accion y estado del sistema generan nuevo estado)
export function reducerDestinosViajes(
    state: DestinosViajesState,
    action: DestinosViajesActions
  ): DestinosViajesState {
    switch (action.type) {
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
