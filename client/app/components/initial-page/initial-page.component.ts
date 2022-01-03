import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ErrorHandlerService } from 'client/app/services/ErrorHandler/error-handler.service';
import { WalletService } from 'client/app/services/WalletService/wallet.service';
import { environment } from 'client/environments/environment';

@Component({
  selector: 'app-initial-page',
  templateUrl: './initial-page.component.html',
  styleUrls: ['./initial-page.component.scss']
})
export class InitialPageComponent implements OnInit {

  @Output() setupDone = new EventEmitter();
  
  isSubmitBtnClicked: boolean = false;
  setupForm: FormGroup = new FormGroup({
    name : new FormControl('', [Validators.required]),
    balance : new FormControl('', Validators.pattern('[0-9]+(\.[0-9])?[0-9]{0,3}')),
  });

  constructor(private walletService: WalletService, private errorHandler: ErrorHandlerService) { }

  ngOnInit(): void {
  }

  onSubmit(): void {
    if (this.setupForm.valid) {
      this.isSubmitBtnClicked = true;
      let amount = 0;
      if (this.setupForm.value.balance) {
        amount = this.setupForm.value.balance
      }
      const data = {
        name: this.setupForm.value.name,
        balance: Number(amount)
      };
      this.walletService.setupWallet(data).subscribe(
        (res: any) => {
          localStorage.setItem(environment.key, res.id);
          this.setupForm.reset();
          this.isSubmitBtnClicked = false;
          alert('Wallet created');
          this.setupDone.emit();
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
