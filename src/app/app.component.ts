import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { LiquidityContractService } from 'src/app/services/liquidity-contract.service';
import { RefundContractService } from 'src/app/services/refund-contract.service';
import { SharedService } from 'src/app/services/shared.service';
import { DialogComponent } from './components/dialog/dialog.component';
import { ReferralLinkDialogComponent } from './components/tokeninfo/referral-link-dialog/referral-link-dialog.component';
import { ContractService } from './services/contract.service';
import { GriseTokenContractService } from './services/grise-token-contract.service';
import { LocalDataUpdateService } from './services/local-data-update.service';
import { MinAbiDataContractService } from './services/minabi-data-contract.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  isLogin = false;
  accountNo = 0;
  totalBalance = 0;
  refAccountNo = '';
  griseBalance = 0;
  currentLPDay = 0;

  constructor(public dialog: MatDialog,
              private contractService: ContractService,
              private sharedService: SharedService,
              private activatedRoute: ActivatedRoute,
              private griseTokenContractService: GriseTokenContractService,
              private localDataUpdateService: LocalDataUpdateService,
              private router: Router,
              private minAbiDataContractService: MinAbiDataContractService,
              private liquidityContractService: LiquidityContractService) { }

  ngOnInit() {
    this.assignContractAccounts();
    this.minAbiDataContractService.setChainId();
    this.sharedService.initPersonalPeriodStakes();
    this.connectToWallet();

    this.localDataUpdateService.isInitSlotsReservationDataUpdated.subscribe((isUpdated) => {
      if (isUpdated) {
        this.sharedService.initSlots();
        this.localDataUpdateService.forceUpdateSlotsReservationData(true);
      }
    });

    this.localDataUpdateService.isWalletBalanceDataUpdated.subscribe(value => {
      if (value && this.isLogin) {
        this.refetchBalance();
      }
    });

    this.liquidityContractService.getCurrentLPDay().then(lpDay => {
      if (lpDay) {
        this.currentLPDay = lpDay;
      }
    });

    this.activatedRoute.queryParams.subscribe(params => {
      this.contractService.referralAccountNo = params.referralCode;
      if (this.contractService.referralAccountNo == null) {
        this.contractService.referralAccountNo = this.contractService.blankReferralAccountNo;
      }
      this.refAccountNo = this.contractService.referralAccountNo;
    });
  }

  openDialog() {
    this.dialog.open(DialogComponent);
  }

  openReferralLinkDialog() {
    this.dialog.open(ReferralLinkDialogComponent);
  }

  logout() {
    this.contractService.isLogin = false;
    this.contractService.accountNo = 0;
    this.contractService.totalBalance = 0;
    this.contractService.totalGriseBalance = 0;
    this.assignGlobalValues();
    // this.sharedService.updateSlotsReservation();
    this.router.navigate(['/']);
  }

  assignGlobalValues() {
    this.isLogin = this.contractService.isLogin;
    this.accountNo = this.contractService.accountNo;
    this.totalBalance = this.contractService.totalBalance;
    this.griseBalance = this.contractService.totalGriseBalance;
  }

  async assignContractAccounts() {
    await this.liquidityContractService.assignLiquidityAccountNo();
    await this.griseTokenContractService.assignGriseAccountNo();
  }

  async connectToWallet() {
    await this.refetchBalance();
    await this.afterConnectToWallet();
  }

  async refetchBalance() {
    await this.contractService.connectToWallet();
    await this.griseTokenContractService.getGriseBalance();
    this.assignGlobalValues();
  }

  async afterConnectToWallet() {
    this.localDataUpdateService.forceUpdateStakeTransactionsData(true);
    this.localDataUpdateService.forceUpdateExchangeRateData(true);
  }
}
