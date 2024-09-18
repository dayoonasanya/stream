import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StartupService } from '../../../services/startup/startup.service';
import { NotificationComponent } from '../../../components/notification/notification.component';

@Component({
  selector: 'app-startups',
  standalone: true,
  imports: [CommonModule, NotificationComponent],
  templateUrl: './startups.component.html',
  styleUrls: ['./startups.component.css'],
})
export class StartupsComponent implements OnInit {
  startups: any[] = [];
  selectedStartup: any | null = null;
  displayStartupModal: boolean = false;

  notificationMessage: string = '';
  notificationType: 'success' | 'error' = 'success';
  showNotification: boolean = false;

  constructor(private startupService: StartupService) {}

  ngOnInit(): void {
    this.loadStartups();
  }

  loadStartups(): void {
    this.startupService.getAllStartups().subscribe(
      (startups: any[]) => {
        this.startups = startups;
      },
      (error) => {
        this.showError('Failed to load startups');
      }
    );
  }

  viewStartup(startup: any): void {
    this.selectedStartup = startup;
    this.displayStartupModal = true;
  }

  closeModal(): void {
    this.displayStartupModal = false;
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