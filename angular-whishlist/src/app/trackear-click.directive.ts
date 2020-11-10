import { Directive, ElementRef, Input } from '@angular/core';
import { Store } from '@ngrx/store';
import { fromEvent } from 'rxjs';
import { AppState } from './app.module';
import { TrackingTagsAction } from './models/destinos-viajes-state.model';

@Directive({
  selector: '[appTrackearClick]'
})
export class TrackearClickDirective {
  private element: HTMLInputElement;

  constructor(private elRef: ElementRef, private store: Store<AppState>) {
    this.element = elRef.nativeElement;
    fromEvent(this.element, 'click').subscribe(evento => this.track(evento));
   }

   track(evento: Event): void {
     const elemTags =this.element.attributes.getNamedItem('data-trackear-tags').value.split( ' ' ); // cuando hacen click se revisa si tiene elementos data-trakear-tags y los guarda separados por ''
     console.log(`||||||||||| track evento: "${elemTags}"`);
     this.store.dispatch(new TrackingTagsAction());
   }

}
