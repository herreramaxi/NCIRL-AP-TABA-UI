import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-bank-loan-calculator',
  templateUrl: './bank-loan-calculator.component.html',
  styleUrls: ['./bank-loan-calculator.component.css']
})

export class BankLoanCalculatorComponent implements OnInit {

  formGroup: FormGroup;
  monthlyPayment: string | undefined;
  totalRepayment: string | undefined;

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

    var url = `api/monthlypayment/${anualInterestRate}/${periodInMonths}/${amount}`;
    this.http.get(url).subscribe(r => {
      if (!r) return;

      const monthlyPaymentValue = parseFloat(r.toString());
      this.monthlyPayment = monthlyPaymentValue.toFixed(2);

      this.http.get(`api/totalrepayment/${monthlyPaymentValue}/${periodInMonths}`).subscribe(s => {
        if (!s) return;
        this.totalRepayment = parseFloat(s.toString()).toFixed(2);
      });
    })
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
