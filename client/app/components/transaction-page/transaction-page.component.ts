import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import { Router } from '@angular/router';
import { ErrorHandlerService } from 'client/app/services/ErrorHandler/error-handler.service';
import { WalletService } from 'client/app/services/WalletService/wallet.service';
import { environment } from 'client/environments/environment';

export interface TransData {
  id: string;
  date: string;
  amount: string;
  balance: string;
  type: string;
  description: string;
}

@Component({
  selector: 'app-transaction-page',
  templateUrl: './transaction-page.component.html',
  styleUrls: ['./transaction-page.component.scss']
})
export class TransactionPageComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = ['id', 'date', 'amount', 'balance', 'type', 'description'];
  dataSource: MatTableDataSource<TransData>;
  walletDetail: any;
  dataFetched: any;
  filterData!: TransData[];
  walletId: any;
  isDataAvailable = false;
  isDataLoading = false;
  queryPram = {
    skip: 0,
    limit: 999999
  };

  @ViewChild(MatPaginator)
  paginator!: MatPaginator;
  @ViewChild(MatSort, {
    static: false
  })
  set sort(value: MatSort) {
    this.dataSource.sort = value;
  }

  constructor(
      private walletService: WalletService,
      private errorHandler: ErrorHandlerService, 
      private router: Router
  ) {
    this.walletId = localStorage.getItem(environment.key);
    if (this.walletId) {
      this.getWalletDetail();
      this.getTransactions();
    } else {
      alert('Please setup a wallet first');
      this.router.navigate(['home']);
    }
    this.dataSource = new MatTableDataSource(this.filterData);
  }

  ngOnInit(): void {
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
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

  getTransactions(): void {
    this.isDataLoading = true;
    this.walletService.getWalletTransactions(this.walletId, this.queryPram.skip, this.queryPram.limit)
    .subscribe(
      (res: any) => {
        this.dataFetched = res;
        this.doDataFilter();
        this.isDataLoading = false;
      },
      (err: any) => {
        this.errorHandler.handleError(err);
        let message = this.errorHandler.getErrorMessage();
        alert('Error: ' + message);
        this.isDataLoading = false;
      }
    );
  }

  doDataFilter(): void {
    this.filterData = this.dataFetched.map((item: any) => {
      return {
        id: item.id,
        date: item.date,
        amount: item.amount.toString(),
        balance: item.balance.toString(),
        type: item.type,
        description: item.description
      };
    });
    this.dataSource.data = this.filterData;
    this.isDataAvailable = true;
  }

  onExportCSV(): void {
    this.downloadFile(this.dataFetched, 'Transactions');
  }

  downloadFile(data: any, filename: string = 'data'): void {
    let csvData = this.ConvertToCSV(data, [...this.displayedColumns, 'walletId']);
    let blob = new Blob(['\ufeff' + csvData], { type: 'text/csv;charset=utf-8;' });
    let dwldLink = document.createElement("a");
    let url = URL.createObjectURL(blob);
    let isSafariBrowser = navigator.userAgent.indexOf('Safari') != -1 && navigator.userAgent.indexOf('Chrome') == -1;
    if (isSafariBrowser) {  //if Safari open in new window to save file with random filename.
        dwldLink.setAttribute("target", "_blank");
    }
    dwldLink.setAttribute("href", url);
    dwldLink.setAttribute("download", filename + ".csv");
    dwldLink.style.visibility = "hidden";
    document.body.appendChild(dwldLink);
    dwldLink.click();
    document.body.removeChild(dwldLink);
  }

  ConvertToCSV(objArray: any, headerList: any): string {
     let array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray;
     let str = '';
     let row = 'S.No,';
     for (let index in headerList) {
         row += headerList[index] + ',';
     }
     row = row.slice(0, -1);
     str += row + '\r\n';
     for (let i = 0; i < array.length; i++) {
         let line = (i+1)+'';
         for (let index in headerList) {
            let head = headerList[index];line += ',' + array[i][head];
         }
         str += line + '\r\n';
     }
     return str;
  }

}
