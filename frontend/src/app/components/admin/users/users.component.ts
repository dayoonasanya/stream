import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserService } from '../../../services/user/user.service';
import { RouterLink } from '@angular/router';
import { User } from '../../../interfaces/user';
import { NotificationComponent } from '../../../components/notification/notification.component';
import { trigger, style, animate, transition } from '@angular/animations';


@Component({
  selector: 'app-users',
  animations: [
    trigger('fadeInAnimation', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('500ms ease-in', style({ opacity: 1 }))
      ])
    ])
  ],
  standalone: true,
  imports: [CommonModule, RouterLink, NotificationComponent],
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css'],
})
export class UsersComponent implements OnInit {
  users: User[] = [];
  selectedUser: User | null = null;
  displayUserModal: boolean = false;

  notificationMessage: string = '';
  notificationType: 'success' | 'error' = 'success';
  showNotification: boolean = false;

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.userService.getAllUsers().subscribe(
      (users: User[]) => {
        this.users = users.filter(user => user.role !== 'ADMIN' && !user.isDeleted);
      },
      (error) => {
        this.showError('Failed to load users');
      }
    );
  }

  getRoleDisplay(role: string): string {
    switch (role) {
      case 'INVESTOR':
        return 'Investor';
      case 'STARTUP':
        return 'Startup';
      case 'ORGANIZATION':
        return 'Organization';
      default:
        return 'User';
    }
  }

  viewUser(user: User): void {
    this.selectedUser = user;
    this.displayUserModal = true;
  }

  closeModal(): void {
    this.displayUserModal = false;
  }

  toggleUserStatus(user: User): void {
    const newStatus = !user.isActivated;
    this.userService.setAccountStatus(user.id, newStatus).subscribe(
      () => {
        user.isActivated = newStatus;
        this.showSuccess(`User ${newStatus ? 'activated' : 'deactivated'} successfully`);
      },
      (error) => {
        this.showError('Failed to update user status');
      }
    );
  }

  deleteUser(userId: string): void {
    this.userService.deleteUser(userId).subscribe(
      () => {
        this.users = this.users.filter((user) => user.id !== userId);
        this.showSuccess('User deleted successfully');
      },
      (error) => {
        this.showError('Failed to delete user');
      }
    );
  }

  
  showSuccess(message: string): void {
    this.notificationMessage = message;
    this.notificationType = 'success';
    this.showNotification = true;
    setTimeout(() => this.showNotification = false, 3000);
  }

  
  showError(message: string): void {
    this.notificationMessage = message;
    this.notificationType = 'error';
    this.showNotification = true;
    setTimeout(() => this.showNotification = false, 3000);
  }

  closeNotification(): void {
    this.showNotification = false;
  }
}