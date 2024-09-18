import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { InvestorService } from '../../../services/investor/investor.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-investor',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './investor.component.html',
  styleUrls: ['./investor.component.css']
})
export class InvestorComponent implements OnInit {
  investorForm: FormGroup;
  isLoading: boolean = false;
  
  constructor(
    private fb: FormBuilder,
    private investorService: InvestorService,
    private router: Router
  ) {
    this.investorForm = this.fb.group({
      investmentBudget: [null, Validators.required],
      interests: this.fb.array([this.fb.control('')]), // Array for interests
      socialMedia: this.fb.array([
        this.fb.group({
          platform: ['LinkedIn', Validators.required],
          url: ['', Validators.required]
        })
      ])
    });
  }

  ngOnInit(): void {}

  // Helper method to get interests as FormArray
  get interests() {
    return this.investorForm.get('interests') as FormArray;
  }

  // Add new interest
  addInterest() {
    this.interests.push(this.fb.control(''));
  }

  // Remove an interest
  removeInterest(index: number) {
    this.interests.removeAt(index);
  }

  // Helper method to get socialMedia as FormArray
  get socialMedia() {
    return this.investorForm.get('socialMedia') as FormArray;
  }

  // Add new social media group
  addSocialMedia() {
    this.socialMedia.push(this.fb.group({
      platform: ['', Validators.required],
      url: ['', Validators.required]
    }));
  }

  // Remove a social media group
  removeSocialMedia(index: number) {
    this.socialMedia.removeAt(index);
  }

  onSubmit() {
    if (this.investorForm.invalid) {
      return;
    }

    this.isLoading = true;

    const investorData = this.investorForm.value;

    this.investorService.createInvestorProfile(investorData).subscribe({
      next: (response) => {
        console.log('Investor profile created:', response);
        this.isLoading = false;
        this.router.navigate(['/home']); // Redirect after successful profile creation
      },
      error: (err) => {
        console.error('Error creating investor profile:', err);
        this.isLoading = false;
      }
    });
  }
}
