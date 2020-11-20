import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'medicar-checkbox',
  templateUrl: './checkbox.component.html',
  styleUrls: ['./checkbox.component.scss']
})
export class CheckboxComponent {
  @Input() placeholder: String = "";
  @Input() class: String = "";

  @Input()  value: Boolean;
  @Output() valueChange = new EventEmitter<Boolean>();

  get inputValue() {
    return this.value;
  }

  set inputValue(value) {
    this.value = value;
    this.valueChange.emit(value);
  }
}
