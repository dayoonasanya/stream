import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProjectService } from '../../../services/project/project.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NotificationComponent } from '../../notification/notification.component';

@Component({
  selector: 'app-create-project',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NotificationComponent],
  templateUrl: './create-project.component.html',
  styleUrls: ['./create-project.component.css']
})
export class CreateProjectComponent {
  createProjectForm: FormGroup;
  uploadedImages: File[] = [];
  uploadedImageUrls: string[] = [];
  isLoading: boolean = false;
  showNotification: boolean = false;  // Notification visibility state
  notificationMessage: string = '';  // Notification message
  notificationType: 'success' | 'error' = 'success';  // Notification type

  constructor(
    private fb: FormBuilder,
    private projectService: ProjectService,
    private router: Router
  ) {
    this.createProjectForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      targetAmount: [0, [Validators.required, Validators.min(1)]],
      type: ['', Validators.required],
      category: ['', Validators.required],
      githubLink: [''],
      landingPageLink: [''],
      images: [null]
    });
  }

  onFileChange(event: any) {
    if (event.target.files) {
      this.uploadedImages = Array.from(event.target.files);
    }
  }

  uploadImageToCloudinary(file: File): Promise<string> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 't2gtalks');
    formData.append('cloud_name', 'dtn9kzx2v');

    return fetch('https://api.cloudinary.com/v1_1/dtn9kzx2v/image/upload', {
      method: 'POST',
      body: formData
    })
    .then(response => response.json())
    .then(data => data.secure_url)
    .catch(() => {
      throw new Error('Failed to upload image');
    });
  }

  async onSubmit() {
    if (this.createProjectForm.invalid) {
      return;
    }

    this.isLoading = true;

    try {
      const imageUploadPromises = this.uploadedImages.map(file => this.uploadImageToCloudinary(file));
      this.uploadedImageUrls = await Promise.all(imageUploadPromises);
    } catch (error) {
      this.showNotificationMessage('Error uploading images. Please try again.', 'error');
      this.isLoading = false;
      return;
    }

    const projectData = {
      ...this.createProjectForm.value,
      images: this.uploadedImageUrls.map(url => ({ url }))
    };

    this.projectService.createProject(projectData).subscribe(
      (response) => {
        this.isLoading = false;
        this.showNotificationMessage('Project created successfully!', 'success');
        this.router.navigate(['/home/projects']);
      },
      (error) => {
        this.isLoading = false;
        this.showNotificationMessage('Error creating project. Please try again.', 'error');
      }
    );
  }

  showNotificationMessage(message: string, type: 'success' | 'error') {
    this.notificationMessage = message;
    this.notificationType = type;
    this.showNotification = true;
    setTimeout(() => this.showNotification = false, 5000);
  }
}
