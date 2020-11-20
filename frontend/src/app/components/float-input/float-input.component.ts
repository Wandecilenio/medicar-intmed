import { Component, Input, Output, EventEmitter } from '@angular/core';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'medicar-float-input',
  templateUrl: './float-input.component.html',
  styleUrls: ['./float-input.component.scss']
})
export class FloatInputComponent {
  eyeIcon = faEye

  @Input() id: String = "";
  @Input() name: String = "";
  @Input() type: String = "text";
  @Input() placeholder: String = "";
  @Input() secure: Boolean = false;
  visible: Boolean = false;

  @Input()  value: String;
  @Output() valueChange = new EventEmitter<String>();

  get inputValue() {
    return this.value;
  }

  set inputValue(value) {
    this.value = value;
    this.valueChange.emit(value);
  }

  get passwordVisible() {
    return this.visible;
  }

  set passwordVisible(visible) {
    this.visible = visible;
    if(visible == true) {
      this.type = "text";
      this.eyeIcon = faEyeSlash;
    } else {
      this.type = "password";
      this.eyeIcon = faEye;
    }
  }
}
