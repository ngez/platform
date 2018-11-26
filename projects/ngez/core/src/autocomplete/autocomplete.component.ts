import { 
  Component, 
  OnInit, 
  TemplateRef, 
  ViewChild, 
  QueryList, 
  ContentChildren, 
  EventEmitter,
  Output } from '@angular/core';
import { ListKeyManager, ActiveDescendantKeyManager } from "@angular/cdk/a11y";
import { NgEzOptionComponent } from '../option';
import { UP_ARROW, DOWN_ARROW, ENTER } from '@angular/cdk/keycodes';
import { merge, Subscription, Observable } from 'rxjs';

@Component({
  selector: 'ngez-autocomplete',
  templateUrl: './autocomplete.component.html',
  styleUrls: ['./autocomplete.component.scss'],
})
export class NgEzAutocompleteComponent {

  @Output() opened = new EventEmitter();

  @Output() closed = new EventEmitter();

  @ViewChild(TemplateRef) template: TemplateRef<any>;

  @ContentChildren(NgEzOptionComponent, { descendants: true }) options: QueryList<NgEzOptionComponent>;

  keyboardEventsManager: ActiveDescendantKeyManager<NgEzOptionComponent>;

  subscription: Subscription;

  optionEventEmitters: Observable<EventEmitter<{}>>;

  constructor() {
    
   }

  ngOnInit(){
    //this.options.changes.subscribe(change => console.log(change))
  }

  ngAfterViewInit() {
    this.keyboardEventsManager = 
      new ActiveDescendantKeyManager(this.options).withWrap(true);
  }

  reset(){
    this.keyboardEventsManager.setActiveItem(-1);
  }

  handleKeyUp(event: KeyboardEvent) {
    event.stopImmediatePropagation();
    if (this.keyboardEventsManager) {
      if (event.keyCode === DOWN_ARROW || event.keyCode === UP_ARROW) {
        // passing the event to key manager so we get a change fired
        this.keyboardEventsManager.onKeydown(event);
        return false;
      } else if (event.keyCode === ENTER) {
        // when we hit enter, the keyboardManager should call the selectItem method of the `ListItemComponent`
        this.keyboardEventsManager.activeItem.onSelect();
        return false;
      }
    }
  }

}
