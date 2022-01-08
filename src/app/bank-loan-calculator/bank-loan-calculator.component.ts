import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-bank-loan-calculator',
  templateUrl: './bank-loan-calculator.component.html',
  styleUrls: ['./bank-loan-calculator.component.css']
})
export class BankLoanCalculatorComponent implements OnInit {

  constructor(private http: HttpClient,) { }

  ngOnInit(): void {
  }

  onClick() {
    console.log("onClick")
    var url = "api/totalrepayment/599.550/360";
    this.http.get(url).subscribe(r => {
      console.log(r)

    })
  }
}
