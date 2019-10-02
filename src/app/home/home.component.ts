import { Component, OnInit } from '@angular/core';
import { SalaryDetails } from '../models/salary-details.model';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  salaryDetails: SalaryDetails;

  constructor() { }

  ngOnInit() {
    this.salaryDetails = new SalaryDetails();
    this.salaryDetails.ctc = 0;
    this.salaryDetails.basic = 0;
    this.salaryDetails.annualBasic = 0;
    this.salaryDetails.calcOnMinBasic = false;
    this.salaryDetails.epfEmployer = 0;
    this.salaryDetails.epfEmployee = 0;
    this.salaryDetails.inHand = 0;
    this.salaryDetails.tax = 0;
    this.salaryDetails.monthlyEpfEmployer = 0;
    this.salaryDetails.monthlyEpfEmployee = 0;
    this.salaryDetails.hra = 0;
    this.salaryDetails.metroResident = false;
    this.salaryDetails.rentPaid = 0;
    this.salaryDetails.hraMonthly = 0;
    this.salaryDetails.hraExemption = 0;
    this.salaryDetails.invest80C = 0;
    this.salaryDetails.monthlyTax = 0;
    this.salaryDetails.gratuity = 0;
    this.salaryDetails.maximize80C = false;
    this.salaryDetails.foodCouponsAvailable = false;
    this.salaryDetails.foodCouponsOpted = false;
    this.salaryDetails.foodCouponsDeduction = 0;
    this.salaryDetails.carLeaseAvailable = false;
    this.salaryDetails.optedForMediclaim = false;
    this.salaryDetails.annualMediclaimAmount = 0;
    this.salaryDetails.monthlyMediclaimAmount = 0;
    this.resetCarLeaseDriversSalaryFuelAndMaintainence();
    this.salaryDetails.netTaxableIncome=0;
  }

  ctcChange(val) {
    this.salaryDetails.basic = (val * 0.4) / 12;
    this.basicChange();
  }

  basicChange() {
    if (!this.validateBasic()) {
      this.salaryDetails.basic = (this.salaryDetails.ctc * 0.4) / 12;
    }
    this.salaryDetails.annualBasic = this.salaryDetails.basic * 12;
    this.salaryDetails.gratuity = this.salaryDetails.annualBasic * 0.0481;
    this.calcBasic();
    this.calcHraAndExemption(this.salaryDetails.metroResident ? 0.5 : 0.4);
    this.calcTax();
    this.calcInHand();
  }

  calcHraAndExemption(rate) {
    this.salaryDetails.hra = this.salaryDetails.annualBasic * rate;
    this.salaryDetails.hraMonthly = this.salaryDetails.hra / 12;
  }

  validateBasic() {
    if (this.salaryDetails.basic * 12 > this.salaryDetails.ctc) {
      alert("Basic pay cannot be greater than 40% of Ctc: " + (this.salaryDetails.ctc * 0.4) / 12);
      return false;
    }
    return true;
  }

  calcOnMinBasic() {
    this.calcBasic();
    this.calcTax();
    this.calcInHand();
  }

  calcBasic() {
    if (this.salaryDetails.calcOnMinBasic && this.salaryDetails.basic >= 15000) {
      this.salaryDetails.epfEmployee = 15000 * 0.12;
      this.salaryDetails.epfEmployer = 15000 * 0.12;
    } else {
      this.salaryDetails.epfEmployee = this.salaryDetails.basic * 0.12;
      this.salaryDetails.epfEmployer = this.salaryDetails.basic * 0.12;
    }
    this.salaryDetails.monthlyEpfEmployee = this.salaryDetails.epfEmployee;
    this.salaryDetails.monthlyEpfEmployer = this.salaryDetails.epfEmployer;
    this.salaryDetails.epfEmployee = this.salaryDetails.epfEmployee * 12;
    this.salaryDetails.epfEmployer = this.salaryDetails.epfEmployer * 12;
    this.salaryDetails.invest80C = this.salaryDetails.maximize80C ? 150000 : this.salaryDetails.epfEmployee;
  }

  calcTax() {
    let netTaxable = this.salaryDetails.ctc - this.salaryDetails.yearlyCarLeaseAmount - this.salaryDetails.yearlyDriversSalaryAmount - this.salaryDetails.yearlyFuelAndMaintainenceAmount - this.salaryDetails.annualMediclaimAmount - this.salaryDetails.foodCouponsDeduction - this.salaryDetails.invest80C - this.salaryDetails.gratuity - this.salaryDetails.epfEmployer - this.salaryDetails.hraExemption - 40000;

    if (netTaxable <= 500000) {
      this.salaryDetails.tax = 0;
    } else if (netTaxable > 500000 && netTaxable <= 1000000) {
      this.salaryDetails.tax = 12500 + (netTaxable - 500000) * 0.2;
    } else {
      this.salaryDetails.tax = 12500 + 100000 + (netTaxable - 1000000) * 0.3;
    }

    this.salaryDetails.netTaxableIncome=netTaxable;
    this.salaryDetails.monthlyTax = this.salaryDetails.tax / 12;

  }

  calcInHand() {
    this.salaryDetails.inHand = (this.salaryDetails.ctc - this.salaryDetails.epfEmployee - this.salaryDetails.gratuity - this.salaryDetails.epfEmployer - this.salaryDetails.tax) / 12;
  }

  submit() {

  }

  metroResident() {
    if (this.salaryDetails.metroResident) {
      this.calcHraAndExemption(0.5);
    } else {
      this.calcHraAndExemption(0.4);
    }
    this.calcTax();
    this.calcInHand();
  }

  rentPaidChange() {
    let rentPaidMinus10Basic = 0;
    if (this.salaryDetails.rentPaid != null && this.salaryDetails.rentPaid > 0) {
      rentPaidMinus10Basic = (this.salaryDetails.rentPaid - (this.salaryDetails.basic * 0.1));
    }
    if (rentPaidMinus10Basic > 0 && rentPaidMinus10Basic < this.salaryDetails.hraMonthly) {
      this.salaryDetails.hraExemption = rentPaidMinus10Basic * 12;
      this.calcTax();
      this.calcInHand();
    } else if (rentPaidMinus10Basic > 0) {
      this.salaryDetails.hraExemption = this.salaryDetails.hra;
    } else {
      this.salaryDetails.hraExemption = 0;
    }
    this.calcTax();
    this.calcInHand();
  }

  invest80CChange(val) {
    if (val > 150000) {
      alert("80C Investments cannot be greater than 150000");
      this.salaryDetails.invest80C = 150000;
    }
    this.calcTax();
    this.calcInHand();
  }

  maximize80C() {
    if (this.salaryDetails.maximize80C) {
      this.salaryDetails.invest80C = 150000;
    } else {
      this.salaryDetails.invest80C = this.salaryDetails.epfEmployee;
    }
    this.calcTax();
    this.calcInHand();
  }

  foodCouponsOpted() {
    if (this.salaryDetails.foodCouponsOpted) {
      this.salaryDetails.foodCouponsDeduction = 2200 * 12;
    } else {
      this.salaryDetails.foodCouponsDeduction = 0;
    }
    this.calcTax();
    this.calcInHand();
  }

  foodCouponsAvailable() {
    this.salaryDetails.foodCouponsDeduction = 0;
    this.salaryDetails.foodCouponsOpted = false;
    this.calcTax();
    this.calcInHand();
  }

  optedForMediclaim() {
    if (!this.salaryDetails.optedForMediclaim) {
      this.salaryDetails.monthlyMediclaimAmount = 0;
      this.salaryDetails.annualMediclaimAmount = 0;
    }
    this.calcTax();
    this.calcInHand();
  }

  annualMediclaimAmount() {
    this.salaryDetails.monthlyMediclaimAmount = this.salaryDetails.annualMediclaimAmount / 12;
    this.calcTax();
    this.calcInHand();
  }

  carLeaseAvailable() {
    if (!this.salaryDetails.carLeaseAvailable) {
      this.resetCarLeaseDriversSalaryFuelAndMaintainence();
    }
    this.calcTax();
    this.calcInHand();
  }

  resetCarLeaseDriversSalaryFuelAndMaintainence(){
    this.salaryDetails.monthlyCarLeaseAmount = 0;
    this.salaryDetails.monthlyDriversSalaryAmount = 0;
    this.salaryDetails.monthlyFuelAndMaintainenceAmount = 0;
    this.salaryDetails.yearlyCarLeaseAmount = 0;
    this.salaryDetails.yearlyDriversSalaryAmount = 0;
    this.salaryDetails.yearlyFuelAndMaintainenceAmount = 0;
  }

  monthlyCarLeaseAmount() {
    if (this.salaryDetails.monthlyCarLeaseAmount > 0) {
      this.salaryDetails.yearlyCarLeaseAmount = this.salaryDetails.monthlyCarLeaseAmount * 12;
      this.salaryDetails.monthlyDriversSalaryAmount = 15000;
      this.salaryDetails.yearlyDriversSalaryAmount = this.salaryDetails.monthlyDriversSalaryAmount * 12;
      this.salaryDetails.monthlyFuelAndMaintainenceAmount = 15000;
      this.salaryDetails.yearlyFuelAndMaintainenceAmount = this.salaryDetails.monthlyFuelAndMaintainenceAmount * 12;
    } else {
      this.resetCarLeaseDriversSalaryFuelAndMaintainence();
    }
    this.calcTax();
    this.calcInHand();
  }

}
