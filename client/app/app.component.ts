import { Component } from '@angular/core';
import { WalletService } from './services/WalletService/wallet.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  constructor(private walletService: WalletService) { 
    if(localStorage.length > 0 && localStorage.getItem(this.walletService.key)) {
      // localStorage.removeItem(this.walletService.key);
    }
  }
  
}
