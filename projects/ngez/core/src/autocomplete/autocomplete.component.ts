import {
  Component,
  OnInit,
  TemplateRef,
  ViewChild,
  QueryList,
  ContentChildren,
  EventEmitter,
  Output,
  ElementRef,
  Input
} from '@angular/core';
import { ActiveDescendantKeyManager } from "@angular/cdk/a11y";
import { NgEzOptionComponent } from '../option';
import { UP_ARROW, DOWN_ARROW, ENTER, TAB } from '@angular/cdk/keycodes';
import { merge, Subscription, Observable } from 'rxjs';
import { NgEzAutocompleteConfig, defaultConfig } from "./models";

@Component({
  selector: 'ngez-autocomplete',
  templateUrl: './autocomplete.component.html',
  styleUrls: ['./autocomplete.component.scss'],
  host: {
    'style.max-height.px': `config.maxHeight`
  }
})
export class NgEzAutocompleteComponent {

  defaultConfig = defaultConfig;

  @Input() config: NgEzAutocompleteConfig

  @Output() opened = new EventEmitter();

  @Output() closed = new EventEmitter();

  @ViewChild(TemplateRef) template: TemplateRef<any>;

  @ViewChild('panel') panel: ElementRef;

  @ContentChildren(NgEzOptionComponent, { descendants: true }) options: QueryList<NgEzOptionComponent>;

  keyboardEventsManager: ActiveDescendantKeyManager<NgEzOptionComponent>;

  subscription: Subscription;

  optionEventEmitters: Observable<EventEmitter<{}>>;

  constructor() {

  }

  ngOnInit() {
    //this.options.changes.subscribe(change => console.log(change))
  }

  ngAfterViewInit() {
    this.keyboardEventsManager =
      new ActiveDescendantKeyManager(this.options).withWrap(true);
  }

  reset() {
    this.keyboardEventsManager.setActiveItem(-1);
  }

  handleKeyDown(event: KeyboardEvent) {
    event.stopImmediatePropagation();
    if (this.keyboardEventsManager) {
      if (event.keyCode === DOWN_ARROW || event.keyCode === UP_ARROW || event.keyCode === TAB) {
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

  xgetScrollTop(){
    const index = this.keyboardEventsManager.activeItemIndex;
    const option = this.keyboardEventsManager.activeItem;
    const offsetHeight =
      this.options.toArray().slice(0, index).reduce((offset, option) => offset + option.getOffsetHeight(), 0);
    const { top, bottom, height } = option.getBoundingClientRect();
    const currentScrollPosition = this.panel.nativeElement.scrollTop;
    const panelHeight = this.panel.nativeElement.offsetHeight;
    console.log({top, bottom, height, offsetHeight: option.getOffsetHeight() }, this.panel.nativeElement.scrollTop)
    if(top < currentScrollPosition)
      return offsetHeight;
    else if(bottom > currentScrollPosition)
      return offsetHeight + option.getOffsetHeight();
    return currentScrollPosition
  }

  getScrollTop() {
    // this.getBoundingClientRect()
    const index = this.keyboardEventsManager.activeItemIndex;
    const option = this.keyboardEventsManager.activeItem;
    const offset =
      this.options.toArray().slice(0, index + 1).reduce((offset, option) => offset + option.getOffsetHeight(), 0);
    const currentScrollPosition = this.panel.nativeElement.scrollTop;
    
    if (offset - option.getOffsetHeight() < currentScrollPosition)
      return offset - option.getOffsetHeight();

    const optionHeight = option.getOffsetHeight();
    
    const panelHeight = this.panel.nativeElement.getBoundingClientRect().height;
    // console.log(panelHeight)
    
    if(offset > currentScrollPosition + panelHeight){
      // console.log(currentScrollPosition)
      // console.log(offset, currentScrollPosition + panelHeight)
      // console.log(offset - panelHeight)
      return Math.max(0, offset - panelHeight)
      // return Math.ceil(offset - panelHeight);
    }
      
    // if (offset + optionHeight > currentScrollPosition + panelHeight)
    //   return Math.max(0, offset - panelHeight + optionHeight);
    
    return currentScrollPosition;
  }

  setScrollTop() {
    if (!this.panel)
      return;

    const scrollTop = this.getScrollTop();
    // console.log(scrollTop)
      this.panel.nativeElement.scrollTop = scrollTop;
  }

}
