import { Component, Input } from '@angular/core';

@Component({
  selector: 'medicar-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss']
})
export class ModalComponent {
  @Input() title: String = "";
  @Input() opened: Boolean = false;
}
