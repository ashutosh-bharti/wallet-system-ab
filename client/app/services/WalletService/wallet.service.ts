import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'client/environments/environment';

@Injectable()
export class WalletService {
  private API_URL = environment.API_URL;

  constructor(private http: HttpClient) { }

  getWalletDetails(id: string) {
    return this.http.get(this.API_URL + '/wallet/' + id);
  }
  
  getWalletTransactions(id: string, skip: number, limit: number) {
    let url = this.API_URL + '/transactions?walletId=' + id + '&skip=' + skip + '&limit=' + limit; 
    return this.http.get(url);
  }
  
  setupWallet(data: any) {
    return this.http.post(this.API_URL + '/setup', data);
  }
  
  doPayment(id: string, data: any) {
    return this.http.post(this.API_URL + '/transact/' + id, data);
  }
}
