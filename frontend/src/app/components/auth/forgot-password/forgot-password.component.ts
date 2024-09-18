import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService } from '../../../services/user/user.service';
import { CommonModule } from '@angular/common';
import { NotificationComponent } from '../../notification/notification.component';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NotificationComponent],
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent {
  forgotPasswordForm: FormGroup;
  showNotification: boolean = false;
  notificationMessage: string = '';
  notificationType: 'success' | 'error' = 'success';
  isSubmitting: boolean = false;
  emailSent: boolean = false;

  constructor(private formBuilder: FormBuilder, private userService: UserService) {
    this.forgotPasswordForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

  onSubmit(): void {
    if (this.forgotPasswordForm.valid) {
      this.isSubmitting = true;
      const { email } = this.forgotPasswordForm.value;
      this.userService.forgotPassword(email).subscribe(
        () => {
          this.isSubmitting = false;
          this.emailSent = true;
          this.showNotificationMessage('Password reset link sent to your email', 'success');
        },
        (error) => {
          this.isSubmitting = false;
          this.showNotificationMessage('Failed to send password reset link. Please try again.', 'error');
        }
      );
    }
  }

  showNotificationMessage(message: string, type: 'success' | 'error'): void {
    this.notificationMessage = message;
    this.notificationType = type;
    this.showNotification = true;
    setTimeout(() => this.showNotification = false, 3000);
  }
}