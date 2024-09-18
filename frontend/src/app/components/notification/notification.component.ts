import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-notification',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.css']
})
export class NotificationComponent implements OnInit {
  @Input() message: string = '';
  @Input() type: 'success' | 'error' = 'success';
  @Output() close = new EventEmitter<void>();

  fadeOut: boolean = false;
  autoCloseTime: number = 5000;

  ngOnInit(): void {
    setTimeout(() => {
      this.handleClose();
    }, this.autoCloseTime);
  }

  handleClose() {
    this.fadeOut = true;
    setTimeout(() => {
      this.close.emit();
    }, 500);
  }
}
