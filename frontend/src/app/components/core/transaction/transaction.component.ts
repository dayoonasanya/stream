import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TransactionService } from '../../../services/transaction/transaction.service';
import { InvestorService } from '../../../services/investor/investor.service';
import { ActivatedRoute } from '@angular/router';
import { loadStripe } from '@stripe/stripe-js';
import { CommonModule } from '@angular/common';
import { FooterComponent } from "../../footer/footer.component";

@Component({
  selector: 'app-transaction',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FooterComponent],
  templateUrl: './transaction.component.html',
  styleUrls: ['./transaction.component.css']
})
export class TransactionComponent implements OnInit {
  transactionForm: FormGroup;
  stripe: any;
  card: any;
  isProcessing: boolean = false;

  constructor(
    private fb: FormBuilder,
    private transactionService: TransactionService,
    private investorService: InvestorService,
    private route: ActivatedRoute
  ) {
    this.transactionForm = this.fb.group({
      amount: [null, [Validators.required, Validators.min(1)]],
      type: ['INVESTMENT', Validators.required],
      projectId: ['', Validators.required],
      investorId: ['', Validators.required]
    });
  }

  async ngOnInit(): Promise<void> {
    this.stripe = await loadStripe('pk_test_51NczznALMsUYHLY6zCMncMT4pFvt5Z9HycPQF1ZXGQbn8Y8KChs6iVt3IpEl5dTBP6rxr2A1qrTxxQLVLNiFXle100DTf8P0zy');
    const elements = this.stripe.elements();
    this.card = elements.create('card');
    this.card.mount('#card-element');

    const projectId = this.route.snapshot.queryParamMap.get('projectId');
    if (projectId) {
      this.transactionForm.patchValue({ projectId });
    }

    this.investorService.getInvestorProfile().subscribe({
      next: (investor) => {
        this.transactionForm.patchValue({ investorId: investor.id });
      },
      error: (err) => {
        console.error('Error fetching investor profile:', err);
      }
    });
  }

  async processPayment() {
    if (this.transactionForm.invalid) {
      return;
    }

    this.isProcessing = true;

    const transactionData = this.transactionForm.value;
    this.transactionService.processTransaction(transactionData).subscribe(async (response) => {
      const clientSecret = response.data.stripePaymentId;

      const { error, paymentIntent } = await this.stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: this.card
        }
      });

      if (error) {
        console.error('Payment error:', error);
        this.isProcessing = false;
      } else if (paymentIntent.status === 'succeeded') {
        console.log('Payment succeeded:', paymentIntent);

        this.transactionService.updateTransactionStatus({
          stripePaymentId: paymentIntent.id,
          status: 'COMPLETED'
        }).subscribe(() => {
          console.log('Transaction updated successfully');
          this.isProcessing = false;
        });
      }
    }, error => {
      console.error('Transaction error:', error);
      this.isProcessing = false;
    });
  }
}
