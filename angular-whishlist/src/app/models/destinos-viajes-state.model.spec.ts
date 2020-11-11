import { 
    reducerDestinosViajes,
    DestinosViajesState,
    initializeDestinosViajesState,
    InitMyDataAction,
    NuevoDestinoAction,
    ElegidoFavoritoAction,
    VoteUpAction,
    VoteDownAction,
    RefreshAction,
    TrackingTagsAction
} from './destinos-viajes-state.model';
import { DestinoViaje } from './destino-viaje.model';

describe('reducerDestinosViajes', () => {
    it('should reduce init data', () => {
        // setup -- arma los objetos necesarios para textear
        const prevState: DestinosViajesState = initializeDestinosViajesState();
        const action: InitMyDataAction = new InitMyDataAction(['destino 1', 'destino 2']);
        // action -- accion sobre el modelo
        const newState: DestinosViajesState = reducerDestinosViajes(prevState, action); // se manda al reducer para que retorne un nuevo valor (en newstate) y validarlo
        // assert -- verificaciones con las salidas esperadas
        expect(newState.items.length).toEqual(2); // verifica que el arreglo enviado sea de longitud 2
        expect(newState.items[0].nombre).toEqual('destino 1'); // verifica el primer nombre del arreglo (si pasa las verificaciones es porue funciona bien)
        // tear down -- en caso de que la prueba afecte el comportamiento del programa (como valores nuevos en base de datos), se deben eliminar al finalizar la prueba
    });

    it('should reduce new item added', () => {
        const prevState: DestinosViajesState = initializeDestinosViajesState();
        const action: NuevoDestinoAction = new NuevoDestinoAction(new DestinoViaje('barcelona', 'url'));
        const newState: DestinosViajesState = reducerDestinosViajes(prevState, action);
        expect(newState.items.length).toEqual(1);
        expect(newState.items[0].nombre).toEqual('barcelona');
    });

    it('should reduce item favorite', () => {
        const prevState: DestinosViajesState = initializeDestinosViajesState();
        const action: ElegidoFavoritoAction = new ElegidoFavoritoAction(new DestinoViaje('barcelona', 'url'));
        const newState: DestinosViajesState = reducerDestinosViajes(prevState, action);
        expect(newState.items.length).toEqual(0);
        expect(newState.favorito.setSelected(true));
    });

    it('should reduce item vote up', () => {
        const prevState: DestinosViajesState = initializeDestinosViajesState();
        const action: VoteUpAction = new VoteUpAction(new DestinoViaje('barcelona', 'url',0));
        const newState: DestinosViajesState = reducerDestinosViajes(prevState, action);
        expect(newState.items.length).toEqual(0);
        expect(action.destino.votes).toEqual(1);
    });

    it('should reduce item vote down', () => {
        const prevState: DestinosViajesState = initializeDestinosViajesState();
        const action: VoteDownAction = new VoteDownAction(new DestinoViaje('barcelona', 'url',0));
        const newState: DestinosViajesState = reducerDestinosViajes(prevState, action);
        expect(newState.items.length).toEqual(0);
        expect(action.destino.votes).toEqual(-1);
    });

    it('should reduce item refresh', () => {
        const prevState: DestinosViajesState = initializeDestinosViajesState();
        const action: RefreshAction = new RefreshAction(new DestinoViaje('barcelona', 'url',5));
        const newState: DestinosViajesState = reducerDestinosViajes(prevState, action);
        expect(newState.items.length).toEqual(0);
        expect(action.destino.votes).toEqual(0);
    });

    it('should reduce item trackingtags', () => {
        const prevState: DestinosViajesState = initializeDestinosViajesState();
        const action: TrackingTagsAction = new TrackingTagsAction();
        const newState: DestinosViajesState = reducerDestinosViajes(prevState, action);
        expect(newState.increment).toEqual(1);
    });
});