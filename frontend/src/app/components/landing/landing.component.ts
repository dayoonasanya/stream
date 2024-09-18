import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NavbarComponent } from '../navbar/navbar.component';
import { FooterComponent } from '../footer/footer.component';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ContactService } from '../../services/contact/contact.service';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [CommonModule, RouterLink, NavbarComponent, FooterComponent, ReactiveFormsModule],
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.css']
})
export class LandingComponent {
  faqs = [
    {
      question: 'How do I invest in a project?',
      answer: `You can browse through available projects, and once you find one that interests you, click the 'Fund Now' button to proceed with your donation or investment.`,
      isExpanded: false
    },
    {
      question: 'Are there any fees for using the platform?',
      answer: `Our platform charges a small transaction fee on successful funding. However, browsing and displaying projects are completely free.`,
      isExpanded: false
    },
    {
      question: 'What type of projects can I find on this platform?',
      answer: `You will find a variety of startups and organizations across different industries such as tech, health, education, and more, all seeking funding to achieve their goals.`,
      isExpanded: false
    },
    {
      question: 'Can I track the progress of the projects I have funded?',
      answer: `Yes! We provide regular updates from project owners on their progress and milestones so you can see how your contributions are being utilized.`,
      isExpanded: false
    },
    {
      question: 'What is the minimum amount I can invest?',
      answer: `The minimum investment varies by project, but most projects allow contributions starting from as low as $10.`,
      isExpanded: false
    },
    {
      question: 'How can I contact the project owners directly?',
      answer: `You can use the built-in messaging feature to communicate with project owners and ask any questions before or after your investment.`,
      isExpanded: false
    }
  ];

  
  subscribeForm: FormGroup;
  isSubmitting: boolean = false;
  subscribeMessage: string = '';
  showSubscribeMessage: boolean = false;
  subscriptionSuccess: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private contactService: ContactService
  ) {
    this.subscribeForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  toggleFAQ(faq: any) {
    faq.isExpanded = !faq.isExpanded;
  }

  onSubscribe(): void {
    if (this.subscribeForm.valid) {
      const email = this.subscribeForm.get('email')?.value;
      this.isSubmitting = true;
      this.contactService.subscribeToNewsletter(email).subscribe(
        () => {
          this.subscriptionSuccess = true;
          this.showSubscribeMessage = true;
          this.subscribeMessage = 'Thank you for subscribing!';
          this.isSubmitting = false;
          this.subscribeForm.reset();
        },
        (error) => {
          this.subscriptionSuccess = false;
          this.showSubscribeMessage = true;
          this.subscribeMessage = 'Failed to subscribe. Please try again.';
          this.isSubmitting = false;
        }
      );
    } else {
      this.subscriptionSuccess = false;
      this.showSubscribeMessage = true;
      this.subscribeMessage = 'Please enter a valid email address.';
    }

    setTimeout(() => {
      this.showSubscribeMessage = false;
    }, 3000);
  }
}