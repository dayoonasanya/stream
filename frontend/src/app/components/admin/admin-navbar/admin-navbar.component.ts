import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { UserService } from '../../../services/user/user.service';
import { AuthService } from '../../../services/auth.service';
import { AdminService } from '../../../services/admin/admin.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NotificationComponent } from '../../../components/notification/notification.component';

@Component({
  selector: 'app-admin-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, NotificationComponent, ReactiveFormsModule],
  templateUrl: './admin-navbar.component.html',
  styleUrls: ['./admin-navbar.component.css']
})
export class AdminNavbarComponent implements OnInit {
  avatarUrl: string = 'assets/profile.jpg';
  userId: string = '';
  showAddAdminForm: boolean = false;
  addAdminForm: FormGroup;
  notificationMessage: string = '';
  notificationType: 'success' | 'error' = 'success';
  showNotification: boolean = false;

  constructor(
    private userService: UserService,
    private authService: AuthService,
    private adminService: AdminService,
    private formBuilder: FormBuilder
  ) {
    this.addAdminForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  ngOnInit(): void {
    this.loadUserProfile();
  }

  loadUserProfile(): void {
    const token = this.authService.getToken();
    const decodedToken = this.authService.decodeToken(token || '');
    this.userId = decodedToken?.userId;

    if (this.userId) {
      this.userService.getUserById(this.userId).subscribe(
        (user) => {
          this.avatarUrl = user.profile?.avatar || 'assets/profile.jpg';
        },
        (error) => {
          console.error('Failed to load user profile', error);
        }
      );
    }
  }

  toggleAddAdminForm(): void {
    if (this.showAddAdminForm) {
      this.showAddAdminForm = false;
    } else {
      this.showAddAdminForm = true;
    }
  }

  onSubmitAddAdmin(): void {
    if (this.addAdminForm.valid) {
      const { email, password } = this.addAdminForm.value;
      this.adminService.registerAdmin(email, password).subscribe(
        () => {
          this.showNotificationMessage('Admin created successfully!', 'success');
          this.toggleAddAdminForm();
          this.addAdminForm.reset();
        },
        (error) => {
          this.showNotificationMessage('Failed to create admin. Please try again.', 'error');
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
