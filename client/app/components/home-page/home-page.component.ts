import { Component, OnInit } from '@angular/core';
import { environment } from 'client/environments/environment';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss']
})
export class HomePageComponent implements OnInit {

  isWalletInitialized: boolean = false;

  constructor() { }

  ngOnInit(): void {
    this.checkLocalStorage();
  }

  checkLocalStorage(): void {
    if(localStorage.length > 0 && localStorage.getItem(environment.key)) {
      this.isWalletInitialized = true;
    } else {
      this.isWalletInitialized = false;
    }
  }

}
