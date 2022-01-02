import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';

import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';

import { UiSwitchModule } from 'ngx-toggle-switch';

import { WalletService } from './services/WalletService/wallet.service';
import { ErrorHandlerService } from './services/ErrorHandler/error-handler.service';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavBarComponent } from './components/nav-bar/nav-bar.component';
import { FooterComponent } from './components/footer/footer.component';
import { Page404Component } from './components/page404/page404.component';
import { HomePageComponent } from './components/home-page/home-page.component';
import { InitialPageComponent } from './components/initial-page/initial-page.component';
import { PaymentPageComponent } from './components/payment-page/payment-page.component';
import { TransactionPageComponent } from './components/transaction-page/transaction-page.component';

@NgModule({
  declarations: [
    AppComponent,
    HomePageComponent,
    TransactionPageComponent,
    NavBarComponent,
    FooterComponent,
    Page404Component,
    InitialPageComponent,
    PaymentPageComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    UiSwitchModule,
    MatTableModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    MatProgressBarModule,
    MatSortModule
  ],
  providers: [
    WalletService,
    ErrorHandlerService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
