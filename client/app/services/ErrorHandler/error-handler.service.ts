import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable()
export class ErrorHandlerService {
  private errorMessage = '';

  constructor(private router: Router) { }

  public getErrorMessage = () => this.errorMessage;

  public handleError = (error: HttpErrorResponse) => {
    if (error.status === 404) {
      this.handle404Error(error);
    }
    else {
      this.handleOtherError(error);
    }
  }

  private handle404Error = (error: HttpErrorResponse) => {
    this.createErrorMessage(error);
    this.router.navigate(['404']);
  }

  private handleOtherError = (error: HttpErrorResponse) => {
    this.createErrorMessage(error);
  }

  private createErrorMessage = (err: HttpErrorResponse) => {
    this.errorMessage = err.error ? (err.error.message ? err.error.message : err.error) : err.statusText;
  }
}
