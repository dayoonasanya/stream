import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrganizationService } from '../../../services/organization/organization.service';
import { AdminService } from '../../../services/admin/admin.service';
import { NotificationComponent } from '../../../components/notification/notification.component';

@Component({
  selector: 'app-organizations',
  standalone: true,
  imports: [CommonModule, NotificationComponent],
  templateUrl: './organizations.component.html',
  styleUrls: ['./organizations.component.css'],
})
export class OrganizationsComponent implements OnInit {
  organizations: any[] = [];
  selectedOrganization: any | null = null;
  displayOrganizationModal: boolean = false;

  notificationMessage: string = '';
  notificationType: 'success' | 'error' = 'success';
  showNotification: boolean = false;

  constructor(
    private organizationService: OrganizationService,
    private adminService: AdminService
  ) {}

  ngOnInit(): void {
    this.loadOrganizations();
  }

  loadOrganizations(): void {
    this.organizationService.getAllOrganizations().subscribe(
      (organizations) => {
        this.organizations = organizations;
      },
      (error) => {
        this.showError('Failed to load organizations');
      }
    );
  }

  viewOrganization(organization: any): void {
    this.selectedOrganization = organization;
    this.displayOrganizationModal = true;
  }

  closeModal(): void {
    this.displayOrganizationModal = false;
  }

  toggleVerificationStatus(organization: any): void {
    const newStatus = !organization.isVerified;
    this.adminService.verifyOrganization(organization.id, newStatus).subscribe(
      () => {
        organization.isVerified = newStatus;
        this.showSuccess(`Organization ${newStatus ? 'verified' : 'unverified'} successfully`);
      },
      (error) => {
        this.showError('Failed to update verification status');
      }
    );
  }

  deleteOrganization(organizationId: string): void {
    this.organizationService.deleteOrganization(organizationId).subscribe(
      () => {
        this.organizations = this.organizations.filter(org => org.id !== organizationId);
        this.showSuccess('Organization deleted successfully');
      },
      (error) => {
        this.showError('Failed to delete organization');
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