import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService } from '../../../services/user/user.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NotificationComponent } from '../../notification/notification.component';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NotificationComponent],
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent {
  resetPasswordForm: FormGroup;
  showNotification: boolean = false;
  notificationMessage: string = '';
  notificationType: 'success' | 'error' = 'success';
  token: string | null = '';
  isSubmitting: boolean = false;

  constructor(
    private formBuilder: FormBuilder, 
    private userService: UserService, 
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.token = this.route.snapshot.queryParamMap.get('token');
    this.resetPasswordForm = this.formBuilder.group({
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    }, { validator: this.passwordMatchValidator });
  }

  passwordMatchValidator(form: FormGroup) {
    return form.get('newPassword')?.value === form.get('confirmPassword')?.value ? null : { 'mismatch': true };
  }

  onSubmit(): void {
    if (this.resetPasswordForm.valid && this.token) {
      this.isSubmitting = true;
      const { newPassword } = this.resetPasswordForm.value;
      this.userService.resetPassword(this.token, newPassword).subscribe(
        () => {
          this.isSubmitting = false;
          this.showNotificationMessage('Password reset successfully', 'success');
          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 3000);
        },
        (error) => {
          this.isSubmitting = false;
          this.showNotificationMessage('Failed to reset password. Please try again.', 'error');
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