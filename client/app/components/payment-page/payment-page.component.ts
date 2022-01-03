import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ErrorHandlerService } from 'client/app/services/ErrorHandler/error-handler.service';
import { WalletService } from 'client/app/services/WalletService/wallet.service';
import { environment } from 'client/environments/environment';

@Component({
  selector: 'app-payment-page',
  templateUrl: './payment-page.component.html',
  styleUrls: ['./payment-page.component.scss']
})
export class PaymentPageComponent implements OnInit {

  isSubmitBtnClicked: boolean = false;
  walletId: any;
  walletDetail: any;
  isCredit: boolean = true;

  paymentForm: FormGroup = new FormGroup({
    amount : new FormControl('', [Validators.required, Validators.pattern('[0-9]+(\.[0-9])?[0-9]{0,3}')]),
    message : new FormControl(''),
  });

  constructor(private walletService: WalletService, private errorHandler: ErrorHandlerService) { }

  ngOnInit(): void {
    this.walletId = localStorage.getItem(environment.key);
    this.getWalletDetail();
  }

  getWalletDetail(): void {
    this.walletService.getWalletDetails(this.walletId).subscribe(
      (res: any) => {
        this.walletDetail = res;
      },
      (err: any) => {
        this.errorHandler.handleError(err);
        let message = this.errorHandler.getErrorMessage();
        alert('Error: ' + message);
      }
    );
  }

  onToggleChange(event: any) {
    this.isCredit = event;
  }

  onSubmit(): void {
    if (this.paymentForm.valid) {
      if (this.paymentForm.value.amount == '0') {
        alert("Amount can't be zero.\n Please enter valid amount.");
        return;
      }
      this.isSubmitBtnClicked = true;
      let message = '';
      let amount = Number(this.paymentForm.value.amount);
      if (!this.isCredit) {
        amount = -amount;
      }
      if (this.paymentForm.value.message) {
        message = this.paymentForm.value.message;
      } else {
        if (this.isCredit) {
          message = 'Credit';
        } else {
          message = 'Debit';
        }
      }
      const data = {
        amount: amount,
        description: message
      };
      this.walletService.doPayment(this.walletId, data).subscribe(
        (res: any) => {
          this.paymentForm.reset();
          this.walletDetail.balance = res.balance;
          this.isSubmitBtnClicked = false;
          alert('Payment done.');
        },
        (err: any) => {
          this.errorHandler.handleError(err);
          let message = this.errorHandler.getErrorMessage();
          this.isSubmitBtnClicked = false;
          alert('Error: ' + message);
        }
      );
    }
  }
}
