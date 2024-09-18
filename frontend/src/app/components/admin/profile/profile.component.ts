import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService } from '../../../services/user/user.service';
import { AuthService } from '../../../services/auth.service';
import { CommonModule } from '@angular/common';
import { NotificationComponent } from '../../notification/notification.component';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, NotificationComponent, ReactiveFormsModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  @ViewChild('fileInput') fileInput!: ElementRef;

  profileForm: FormGroup;
  avatarUrl: string = '';
  userId: string = '';
  showNotification: boolean = false;
  notificationMessage: string = '';
  notificationType: 'success' | 'error' = 'success';
  isLoading: boolean = false;
  uploadedFileName: string = '';

  constructor(
    private userService: UserService,
    private authService: AuthService,
    private formBuilder: FormBuilder
  ) {
    this.profileForm = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      bio: [''],
      avatar: [''],
      linkedin: [''],
      github: ['']
    });
  }

  ngOnInit(): void {
    this.loadProfile();
  }

  loadProfile(): void {
    const token = this.authService.getToken();
    const decodedToken = this.decodeToken(token || '');
    this.userId = decodedToken?.userId;

    this.userService.getUserById(this.userId).subscribe(
      (user) => {
        this.profileForm.patchValue({
          firstName: user.profile?.firstName || '',
          lastName: user.profile?.lastName || '',
          bio: user.profile?.bio || '',
          linkedin: user.socialMediaLinks?.find((link: { platform: string }) => link.platform === 'LinkedIn')?.url || '',
          github: user.socialMediaLinks?.find((link: { platform: string }) => link.platform === 'GitHub')?.url || ''
        });
        this.avatarUrl = user.profile?.avatar || '';
      },
      (error) => {
        this.showNotificationMessage('Failed to load profile', 'error');
      }
    );
  }

  onSubmitProfile(): void {
    if (this.profileForm.valid) {
      const profileData = {
        profile: {
          firstName: this.profileForm.value.firstName,
          lastName: this.profileForm.value.lastName,
          bio: this.profileForm.value.bio,
          avatar: this.avatarUrl || this.profileForm.value.avatar,
        },
        socialMediaLinks: [
          { platform: 'LinkedIn', url: this.profileForm.value.linkedin },
          { platform: 'GitHub', url: this.profileForm.value.github }
        ]
      };
  
      this.userService.updateProfile(profileData).subscribe(
        () => {
          this.showNotificationMessage('Profile updated successfully', 'success');
        },
        (error) => {
          this.showNotificationMessage('Failed to update profile', 'error');
        }
      );
    }
  }

  onAvatarUpload(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.uploadedFileName = file.name;
      this.uploadImageToCloudinary(file);
    }
  }

  uploadImageToCloudinary(file: File): void {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 't2gtalks');
    formData.append('cloud_name', 'dtn9kzx2v');

    this.isLoading = true;

    fetch('https://api.cloudinary.com/v1_1/dtn9kzx2v/image/upload', {
      method: 'POST',
      body: formData
    })
      .then(response => response.json())
      .then(data => {
        this.profileForm.patchValue({ avatar: data.secure_url });
        this.avatarUrl = data.secure_url;
        this.isLoading = false;
        this.showNotificationMessage('Image uploaded successfully!', 'success');
      })
      .catch(() => {
        this.isLoading = false;
        this.showNotificationMessage('Failed to upload image. Please try again.', 'error');
      });
  }

  showNotificationMessage(message: string, type: 'success' | 'error'): void {
    this.notificationMessage = message;
    this.notificationType = type;
    this.showNotification = true;
    setTimeout(() => this.showNotification = false, 3000);
  }

  decodeToken(token: string): any {
    if (!token) return null;
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    return JSON.parse(atob(base64));
  }

  
  triggerFileInput(): void {
    this.fileInput.nativeElement.click();
  }
}