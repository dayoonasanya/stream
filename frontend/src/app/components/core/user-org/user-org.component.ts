import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { OrganizationService } from '../../../services/organization/organization.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-user-org',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './user-org.component.html',
  styleUrls: ['./user-org.component.css']
})
export class UserOrgComponent implements OnInit {
  organizationForm: FormGroup;
  isLoading: boolean = false;
  isUpdate: boolean = false;
  logoUrl: string = ''; 
  isUploading: boolean = false;

  constructor(
    private fb: FormBuilder,
    private organizationService: OrganizationService,
    private router: Router
  ) {
    this.organizationForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      website: ['', Validators.required],
      logoUrl: ['', Validators.required],
      socialMedia: this.fb.array([
        this.fb.group({
          platform: ['LinkedIn', Validators.required],
          url: ['', Validators.required]
        })
      ])
    });
  }

  ngOnInit(): void {
    this.loadOrganizationProfile();
  }


  loadOrganizationProfile(): void {
    this.isLoading = true;
    this.organizationService.getOrganizationProfileByUserId().subscribe(
      (profile) => {
        if (profile) {
          this.isUpdate = true;
          this.logoUrl = profile.logoUrl;
          this.organizationForm.patchValue({
            name: profile.name,
            description: profile.description,
            website: profile.website,
            logoUrl: profile.logoUrl,
          });
          this.loadSocialMedia(profile.socialMedia);
        }
        this.isLoading = false;
      },
      (error) => {
        console.error('Error loading organization profile:', error);
        this.isLoading = false;
      }
    );
  }

  loadSocialMedia(socialMediaLinks: any[]): void {
    const socialMediaArray = this.socialMediaControls;
    socialMediaArray.clear();
    socialMediaLinks.forEach((link) => {
      socialMediaArray.push(this.fb.group({
        platform: [link.platform, Validators.required],
        url: [link.url, Validators.required]
      }));
    });
  }

  get socialMediaControls() {
    return this.organizationForm.get('socialMedia') as FormArray;
  }

  addSocialMedia() {
    this.socialMediaControls.push(
      this.fb.group({
        platform: [''],
        url: ['']
      })
    );
  }

  removeSocialMedia(index: number) {
    this.socialMediaControls.removeAt(index);
  }

  onLogoUpload(event: any) {
    this.isUploading = true;
    const file = event.target.files[0];
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "t2gtalks");
    formData.append("cloud_name", "dtn9kzx2v");

    fetch('https://api.cloudinary.com/v1_1/dtn9kzx2v/image/upload', {
      method: 'POST',
      body: formData
    }).then(res => res.json())
      .then(data => {
        this.logoUrl = data.secure_url;
        this.organizationForm.patchValue({ logoUrl: this.logoUrl });
        this.isUploading = false;
      }).catch(error => {
        console.error('Error uploading logo:', error);
        this.isUploading = false;
      });
  }

  onSubmit() {
    if (this.organizationForm.invalid) {
      return;
    }

    this.isLoading = true;
    const organizationData = this.organizationForm.value;

    if (this.isUpdate) {
      this.organizationService.updateOrganizationProfile(organizationData).subscribe(
        (response) => {
          console.log('Organization profile updated:', response);
          this.isLoading = false;
          this.router.navigate(['/home']);
        },
        (error) => {
          console.error('Error updating organization profile:', error);
          this.isLoading = false;
        }
      );
    } else {
      this.organizationService.createOrganizationProfile(organizationData).subscribe(
        (response) => {
          console.log('Organization profile created:', response);
          this.isLoading = false;
          this.router.navigate(['/home']);
        },
        (error) => {
          console.error('Error creating organization profile:', error);
          this.isLoading = false;
        }
      );
    }
  }
}
