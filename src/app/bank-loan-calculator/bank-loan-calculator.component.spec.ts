import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BankLoanCalculatorComponent } from './bank-loan-calculator.component';

describe('BankLoanCalculatorComponent', () => {
  let component: BankLoanCalculatorComponent;
  let fixture: ComponentFixture<BankLoanCalculatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BankLoanCalculatorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BankLoanCalculatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
