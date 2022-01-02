import { Component, OnInit } from '@angular/core';
import { WalletService } from 'client/app/services/WalletService/wallet.service';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss']
})
export class HomePageComponent implements OnInit {

  isWalletInitialized: boolean = false;

  constructor(private walletService: WalletService) { }

  ngOnInit(): void {
    this.checkLocalStorage();
  }

  checkLocalStorage(): void {
    if(localStorage.length > 0 && localStorage.getItem(this.walletService.key)) {
      this.isWalletInitialized = true;
    } else {
      this.isWalletInitialized = false;
    }
  }

}
