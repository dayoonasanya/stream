import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ContactService } from '../../services/contact/contact.service';
import { NotificationComponent } from '../notification/notification.component';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../navbar/navbar.component';
import { FooterComponent } from '../footer/footer.component';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, NotificationComponent, ReactiveFormsModule, NavbarComponent, FooterComponent],
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css'],
})
export class ContactComponent implements OnInit {
  contactForm: FormGroup;
  showNotification: boolean = false;
  notificationMessage: string = '';
  notificationType: 'success' | 'error' = 'success';
  isLoading: boolean = true;
  isSubmitting: boolean = false;

  constructor(private formBuilder: FormBuilder, private contactService: ContactService) {
    this.contactForm = this.formBuilder.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      subject: ['', Validators.required],
      message: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    setTimeout(() => {
      this.isLoading = false;
    }, 1000);
  }

  onSubmit(): void {
    if (this.contactForm.valid) {
      this.isSubmitting = true;
      const { name, email, subject, message } = this.contactForm.value;

      this.contactService.submitContactForm(name, email, subject, message).subscribe(
        () => {
          this.showNotificationMessage('Thank you for reaching out, We will get back to you shortly', 'success');
          this.contactForm.reset();
          this.isSubmitting = false;
        },
        (error) => {
          this.showNotificationMessage('Failed to submit the contact form. Please try again.', 'error');
          this.isSubmitting = false;
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
