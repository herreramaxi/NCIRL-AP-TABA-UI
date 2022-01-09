import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject, catchError, finalize, Observable, of, retry, tap, throwError } from 'rxjs';

@Component({
  selector: 'app-bank-loan-calculator',
  templateUrl: './bank-loan-calculator.component.html',
  styleUrls: ['./bank-loan-calculator.component.css']
})

export class BankLoanCalculatorComponent implements OnInit {

  formGroup: FormGroup;
  monthlyPayment: string | undefined;
  totalRepayment: string | undefined;
  loading = new BehaviorSubject<boolean>(false);

  constructor(private http: HttpClient, private fb: FormBuilder) {
    this.formGroup = this.fb.group({
      amount: ['', [Validators.required]],
      anualInterestRate: ['', [Validators.required, Validators.min(0.00001), Validators.max(100)]],
      periodInMonths: ['', [Validators.required, Validators.min(1), Validators.max(480)]]
    });
  }

  ngOnInit(): void {
  }

  onSubmit() {
    if (!this.formGroup || !this.formGroup.valid) return;

    var amount = this.formGroup.get('amount')?.value;
    var anualInterestRate = this.formGroup.get('anualInterestRate')?.value;
    var periodInMonths = this.formGroup.get('periodInMonths')?.value;

    this.loading.next(true);

    this.http.get(`api/monthlypayment/${anualInterestRate}/${periodInMonths}/${amount}`)
      .pipe(
        retry(3),
        catchError(err => this.handleError(err, 1)),
        finalize(() => this.loading.next(false))
      )
      .subscribe((r: any) => {
        const monthlyPaymentValue = parseFloat(r.value.toString());

        if (monthlyPaymentValue <= 0)
          return;

        this.monthlyPayment = monthlyPaymentValue.toFixed(2);

        this.http.get(`api/totalrepayment/${monthlyPaymentValue}/${periodInMonths}`)
          .subscribe((s: any) => {
            this.totalRepayment = parseFloat(s.value.toString()).toFixed(2);
          });
      });
  }

  handleError(error: HttpErrorResponse, customErrorCode: any) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error: ${error.error.message}`;
    } else {
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    errorMessage += ", customErrorCode: " + customErrorCode;

    console.log(errorMessage);

    return of(-1);
  }

  clearControls() {
    this.monthlyPayment = undefined;
    this.totalRepayment = undefined;
    this.formGroup.reset();
  }

  isValidInput(fieldName: any): boolean {
    return this.formGroup.controls[fieldName].invalid &&
      (this.formGroup.controls[fieldName].dirty || this.formGroup.controls[fieldName].touched);
  }
}
