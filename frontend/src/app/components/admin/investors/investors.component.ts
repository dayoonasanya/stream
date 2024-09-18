import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserService } from '../../../services/user/user.service';
import { User } from '../../../interfaces/user';
import { NotificationComponent } from '../../../components/notification/notification.component';

@Component({
  selector: 'app-investors',
  standalone: true,
  imports: [CommonModule, NotificationComponent],
  templateUrl: './investors.component.html',
  styleUrls: ['./investors.component.css'],
})
export class InvestorsComponent implements OnInit {
  investors: User[] = [];
  selectedInvestor: User | null = null;
  displayInvestorModal: boolean = false;

  notificationMessage: string = '';
  notificationType: 'success' | 'error' = 'success';
  showNotification: boolean = false;

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.loadInvestors();
  }

  loadInvestors(): void {
    this.userService.getAllUsers().subscribe(
      (users: User[]) => {
        this.investors = users.filter(
          (user) => user.role === 'INVESTOR' && !user.isDeleted
        );
      },
      (error) => {
        this.showError('Failed to load investors');
      }
    );
  }

  viewInvestor(investor: User): void {
    this.selectedInvestor = investor;
    this.displayInvestorModal = true;
  }

  closeModal(): void {
    this.displayInvestorModal = false;
  }

  toggleUserStatus(investor: User): void {
    const newStatus = !investor.isActivated;
    this.userService.setAccountStatus(investor.id, newStatus).subscribe(
      () => {
        investor.isActivated = newStatus;
        this.showSuccess(`Investor ${newStatus ? 'activated' : 'deactivated'} successfully`);
      },
      (error) => {
        this.showError('Failed to update investor status');
      }
    );
  }

  deleteInvestor(investorId: string): void {
    this.userService.deleteUser(investorId).subscribe(
      () => {
        this.investors = this.investors.filter((investor) => investor.id !== investorId);
        this.showSuccess('Investor deleted successfully');
      },
      (error) => {
        this.showError('Failed to delete investor');
      }
    );
  }

  showSuccess(message: string): void {
    this.notificationMessage = message;
    this.notificationType = 'success';
    this.showNotification = true;
  }

  showError(message: string): void {
    this.notificationMessage = message;
    this.notificationType = 'error';
    this.showNotification = true;
  }

  closeNotification(): void {
    this.showNotification = false;
  }
}
