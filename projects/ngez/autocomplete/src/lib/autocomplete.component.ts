import { Component, OnInit, HostBinding, TemplateRef, ViewChild, QueryList, ViewChildren } from '@angular/core';
import { ListKeyManager } from "@angular/cdk/a11y";
import { AutocompleteOptionComponent } from './autocomplete-option.component';
import { UP_ARROW, DOWN_ARROW, ENTER } from '@angular/cdk/keycodes';

@Component({
  selector: 'ngez-autocomplete',
  templateUrl: './autocomplete.component.html',
  styleUrls: ['./autocomplete.component.scss'],
})
export class AutocompleteComponent implements OnInit {

  @ViewChild(TemplateRef) template: TemplateRef<any>;

  @ViewChildren(AutocompleteOptionComponent) options: QueryList<AutocompleteOptionComponent>;

  keyboardEventsManager: ListKeyManager<AutocompleteOptionComponent>;

  constructor() { }

  ngOnInit() {
    this.keyboardEventsManager = new ListKeyManager(this.options)
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
