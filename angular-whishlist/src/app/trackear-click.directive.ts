import { Directive, ElementRef } from '@angular/core';
import { fromEvent } from 'rxjs';

@Directive({
  selector: '[appTrackearClick]'
})
export class TrackearClickDirective {
  private element: HTMLInputElement;

  constructor(private elRef: ElementRef) {
    this.element = elRef.nativeElement;
    fromEvent(this.element, 'click').subscribe(evento => this.track(evento));
   }

   track(evento: Event): void {
     const elemTags =this.element.attributes.getNamedItem('data-trackear-tags').value.split( ' ' ); // cuando hacen click se revisa si tiene elementos data-trakear-tags y los guarda separados por ''
     console.log(`||||||||||| track evento: "${elemTags}"`);
   }

}
