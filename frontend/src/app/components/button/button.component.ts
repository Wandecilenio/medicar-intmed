import { Component, Input, Output, EventEmitter } from '@angular/core';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';

@Component({
  selector: 'medicar-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss']
})
export class ButtonComponent {
  @Input()
  public type: String = "submit";

  @Input()
  public text: String;

  @Input()
  public classes: String;

  @Input()
  public primary: Boolean;

  @Input()
  public small: Boolean;

  @Input()
  public disabled: Boolean = false;

  @Input()
  public icon: IconDefinition;

  @Output() onClick = new EventEmitter<void>();

  public click() {
    this.onClick.emit();
  }
}
