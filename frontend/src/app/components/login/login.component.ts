import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { NavbarComponent } from "../navbar/navbar.component";
import { FooterComponent } from '../footer/footer.component';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { NotificationComponent } from '../notification/notification.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [NavbarComponent, FooterComponent, CommonModule, RouterLink, NotificationComponent, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loading: boolean = true;
  passwordVisible: boolean = false;
  email: string = '';
  password: string = '';
  notificationMessage: string = '';
  notificationType: 'success' | 'error' = 'success';
  showNotification: boolean = false;
  isSubmitting: boolean = false;

  constructor(private authService: AuthService, private router: Router) {
    setTimeout(() => {
      this.loading = false;
    }, 200);
  }

  togglePasswordVisibility() {
    this.passwordVisible = !this.passwordVisible;
  }

  /**
   * Handles login
   */
  onLogin() {
    if (!this.email || !this.password) {
      this.showNotificationMessage('All fields are required', 'error');
      return;
    }
  
    this.isSubmitting = true;
  
    this.authService.login(this.email, this.password).subscribe({
      next: (response) => {
        setTimeout(() => {
          this.showNotificationMessage('Login successful!', 'success');
          setTimeout(() => {
            this.redirectUserBasedOnRole(response.user.role);
            this.isSubmitting = false;
          }, 2000);
        }, 1500);
      },
      error: (err) => {
        console.error('Login failed', err);
        this.handleLoginError(err);
        this.isSubmitting = false;
      }
    });
  }

  /**
   * Redirect user based on their role
   */
  redirectUserBasedOnRole(role: string) {
    if (role === 'ADMIN') {
      this.router.navigate(['/admin']);
    } else {
      this.router.navigate(['/home']);
    }
  }

  /**
   * Handle specific login errors
   */
  handleLoginError(err: any) {
    if (err.error && err.error.message) {
      if (err.error.message.includes('Email does not exist')) {
        this.showNotificationMessage('Email does not exist', 'error');
      } else if (err.error.message.includes('Incorrect password')) {
        this.showNotificationMessage('Password is incorrect', 'error');
      } else {
        this.showNotificationMessage('Login failed. Please try again.', 'error');
      }
    } else {
      this.showNotificationMessage('Login failed. Please try again.', 'error');
    }
  }

  showNotificationMessage(message: string, type: 'success' | 'error') {
    this.notificationMessage = message;
    this.notificationType = type;
    this.showNotification = true;
    setTimeout(() => {
      this.showNotification = false;
    }, 3000);
  }
}
