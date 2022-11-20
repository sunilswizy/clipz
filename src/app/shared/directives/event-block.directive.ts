import { Directive , HostListener} from '@angular/core';

@Directive({
  selector: '[app-event-block]'
})
export class EventBlockDirective {


  @HostListener('drop', ['$event'])
  @HostListener('dragover', ['$event'])
  public handleEvenet(event: Event) {
      event.preventDefault();
  }

}
